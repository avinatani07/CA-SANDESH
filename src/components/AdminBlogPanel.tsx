import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '../state/auth';
import { createBlogPost, fetchPublishedBlogPosts, removeBlogPost, seedPosts, updateBlogPost, uploadBlogImage, upsertBlogPostByLegacyId } from '../state/blog';
import type { BlogPost } from '../state/blog';

const categories = [
  'Blogs',
  'Income Tax',
  'GST',
  'Tax Filing',
  'Business Advisory',
  'Business Planning',
  'Wealth Planning',
  'Other',
];

function monthYearLabel(ts: number) {
  return new Date(ts).toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function insertAroundSelection(text: string, start: number, end: number, prefix: string, suffix: string) {
  const before = text.slice(0, start);
  const selected = text.slice(start, end);
  const after = text.slice(end);
  return {
    nextText: `${before}${prefix}${selected}${suffix}${after}`,
    nextSelectionStart: start + prefix.length,
    nextSelectionEnd: end + prefix.length,
  };
}

export default function AdminBlogPanel() {
  const { user, isAdminOpen, closeAdmin, openSignIn } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [dateLabel, setDateLabel] = useState(monthYearLabel(Date.now()));
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPublishedBlogPosts().then((next) => {
      if (!isMounted) return;
      setPosts(next);
    });
    return () => {
      isMounted = false;
    };
  }, [isAdminOpen]);

  const derived = useMemo(() => {
    return {
      dateLabel,
      readTime: estimateReadTime(`${excerpt}\n${content}`),
    };
  }, [dateLabel, excerpt, content]);

  const displayPosts = useMemo(() => {
    const overrides = new Map<string, BlogPost>();
    const standalone: BlogPost[] = [];

    for (const p of posts) {
      if (p.legacyId) overrides.set(p.legacyId, p);
      else standalone.push(p);
    }

    const mergedSeeds = seedPosts.map((seed) => overrides.get(seed.id) ?? seed);
    return [...standalone, ...mergedSeeds].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  const imagePreviewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl;
  }, [imageFile, imageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imageFile, imagePreviewUrl]);

  function refresh() {
    fetchPublishedBlogPosts().then((next) => setPosts(next));
  }

  async function onSave() {
    if (!user) {
      closeAdmin();
      openSignIn();
      return;
    }

    const cleanTitle = title.trim();
    const cleanExcerpt = excerpt.trim();
    const cleanContent = content.trim();
    const cleanTags = tags
      .split(/[,\n]/g)
      .map((t) => t.trim())
      .filter(Boolean);
    const uniqueTags = Array.from(new Set(cleanTags)).slice(0, 12);

    if (!cleanTitle || !cleanExcerpt || !cleanContent) return;

    let nextImageUrl = imageUrl;
    if (imageFile) {
      const uploaded = await uploadBlogImage(imageFile);
      if (!uploaded.ok) return;
      nextImageUrl = uploaded.url;
    }

    const payload = {
      title: cleanTitle,
      excerpt: cleanExcerpt,
      category,
      dateLabel: derived.dateLabel,
      readTime: derived.readTime,
      content: cleanContent,
      imageUrl: nextImageUrl,
      tags: uniqueTags,
      legacyId: editingKey?.startsWith('seed_') ? editingKey : null,
    };

    if (editingKey) {
      const res = editingKey.startsWith('seed_')
        ? await upsertBlogPostByLegacyId(editingKey, payload)
        : await updateBlogPost(editingKey, payload);
      if (!res.ok) return;
    } else {
      const created = await createBlogPost(payload);
      if (!created.ok) return;
    }

    setTitle('');
    setExcerpt('');
    setContent('');
    setTags('');
    setImageUrl(null);
    setImageFile(null);
    setEditingKey(null);
    setDateLabel(monthYearLabel(Date.now()));
    refresh();

    // notify Blog section to re-render
    window.dispatchEvent(new Event('jaiman:blog-updated'));
  }

  async function onDelete(id: string) {
    const res = await removeBlogPost(id);
    if (!res.ok) return;
    refresh();
    window.dispatchEvent(new Event('jaiman:blog-updated'));
  }

  function applyFormatting(kind: 'bold' | 'italic' | 'h2' | 'ul' | 'link') {
    const el = document.getElementById('blog-content-editor') as HTMLTextAreaElement | null;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    let prefix = '';
    let suffix = '';

    if (kind === 'bold') {
      prefix = '**';
      suffix = '**';
    } else if (kind === 'italic') {
      prefix = '*';
      suffix = '*';
    } else if (kind === 'h2') {
      prefix = '## ';
      suffix = '';
    } else if (kind === 'ul') {
      prefix = '- ';
      suffix = '';
    } else {
      prefix = '[';
      suffix = '](https://)';
    }

    const { nextText, nextSelectionStart, nextSelectionEnd } = insertAroundSelection(content, start, end, prefix, suffix);
    setContent(nextText);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    });
  }

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/50 px-4 py-6 overflow-y-auto"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAdmin();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-primary-600 font-heading">Blog admin</h3>
                <p className="text-sm text-neutral-600">Create and manage blog posts.</p>
              </div>
              <button
                type="button"
                onClick={closeAdmin}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {!user ? (
              <div className="px-6 py-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-amber-900 font-semibold">You’re not signed in.</p>
                  <p className="text-amber-800 text-sm mt-1">Sign in to create blog posts.</p>
                  <button
                    type="button"
                    onClick={() => {
                      closeAdmin();
                      openSignIn();
                    }}
                    className="mt-4 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-800">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent-400/60"
                      placeholder="Blog title"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-800">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent-400/60"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-800">Date / Read time</label>
                      <div className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-700 bg-neutral-50">
                        {derived.dateLabel} · {derived.readTime}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-800">Excerpt</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent-400/60"
                      placeholder="Short summary shown on the blog cards…"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-800">Tags (comma separated)</label>
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent-400/60"
                      placeholder="income tax, gst, audit, compliance"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-800">Image (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setImageFile(f);
                      }}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {imagePreviewUrl && (
                      <div className="overflow-hidden rounded-xl border border-neutral-200">
                        <img src={imagePreviewUrl} alt="Blog" className="w-full h-44 object-cover" loading="lazy" />
                      </div>
                    )}
                    {(imagePreviewUrl || imageFile) && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImageUrl(null);
                        }}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove image
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-neutral-800">Content (Markdown)</label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => applyFormatting('bold')}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
                        >
                          Bold
                        </button>
                        <button
                          type="button"
                          onClick={() => applyFormatting('italic')}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
                        >
                          Italic
                        </button>
                        <button
                          type="button"
                          onClick={() => applyFormatting('h2')}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => applyFormatting('ul')}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
                        >
                          List
                        </button>
                        <button
                          type="button"
                          onClick={() => applyFormatting('link')}
                          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 hover:border-accent-400 transition-colors"
                        >
                          Link
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="blog-content-editor"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={10}
                      className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 font-mono text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent-400/60"
                      placeholder="Write your blog content here (Markdown supported)…"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {editingKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingKey(null);
                          setTitle('');
                          setCategory(categories[0]);
                          setDateLabel(monthYearLabel(Date.now()));
                          setExcerpt('');
                          setContent('');
                          setTags('');
                          setImageUrl(null);
                          setImageFile(null);
                        }}
                        className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        Cancel edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={!title.trim() || !excerpt.trim() || !content.trim()}
                      className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60 transition-colors"
                    >
                      {editingKey ? 'Save changes' : 'Publish post'}
                    </button>
                  </div>
                </div>

                {/* Posts list */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-neutral-900 font-heading">Your published posts</h4>
                    <span className="text-xs text-neutral-500">Stored online</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {displayPosts.length === 0 ? (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                        No posts yet. Publish your first post on the left.
                      </div>
                    ) : (
                      displayPosts.map((p) => (
                        <div
                          key={p.legacyId ?? p.id}
                          className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-accent-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-neutral-900">{p.title}</div>
                              <div className="mt-1 text-xs text-neutral-500">
                                {p.category} · {p.dateLabel} · {p.readTime}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingKey(p.legacyId ?? p.id);
                                  setTitle(p.title);
                                  setCategory(p.category);
                                  setDateLabel(p.dateLabel);
                                  setExcerpt(p.excerpt);
                                  setContent(p.content);
                                  setTags((p.tags ?? []).join(', '));
                                  setImageUrl(p.imageUrl ?? null);
                                  setImageFile(null);
                                }}
                                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
                                aria-label="Edit post"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              {!p.id.startsWith('seed_') && (
                                <button
                                  type="button"
                                  onClick={() => onDelete(p.id)}
                                  className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  aria-label="Delete post"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-neutral-700 line-clamp-2">{p.excerpt}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
