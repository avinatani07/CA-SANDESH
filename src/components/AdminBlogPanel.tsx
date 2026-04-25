import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { useAuth } from '../state/auth';
import { addBlogPost, deleteBlogPost, loadBlogPosts, type BlogPost } from '../state/blog';

const categories = [
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
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setPosts(loadBlogPosts());
  }, [isAdminOpen]);

  const derived = useMemo(() => {
    const now = Date.now();
    return {
      dateLabel: monthYearLabel(now),
      readTime: estimateReadTime(`${excerpt}\n${content}`),
    };
  }, [excerpt, content]);

  function refresh() {
    setPosts(loadBlogPosts());
  }

  function onCreate() {
    if (!user) {
      closeAdmin();
      openSignIn();
      return;
    }

    const cleanTitle = title.trim();
    const cleanExcerpt = excerpt.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanExcerpt || !cleanContent) return;

    addBlogPost({
      title: cleanTitle,
      excerpt: cleanExcerpt,
      category,
      dateLabel: derived.dateLabel,
      readTime: derived.readTime,
      content: cleanContent,
    });

    setTitle('');
    setExcerpt('');
    setContent('');
    refresh();

    // notify Blog section to re-render
    window.dispatchEvent(new Event('jaiman:blog-updated'));
  }

  function onDelete(id: string) {
    deleteBlogPost(id);
    refresh();
    window.dispatchEvent(new Event('jaiman:blog-updated'));
  }

  function applyFormatting(kind: 'bold' | 'italic' | 'h2' | 'ul' | 'link') {
    const el = document.getElementById('blog-content-editor') as HTMLTextAreaElement | null;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
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
    } else if (kind === 'link') {
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
                    <button
                      type="button"
                      onClick={onCreate}
                      disabled={!title.trim() || !excerpt.trim() || !content.trim()}
                      className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60 transition-colors"
                    >
                      Publish post
                    </button>
                  </div>
                </div>

                {/* Posts list */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-neutral-900 font-heading">Your published posts</h4>
                    <span className="text-xs text-neutral-500">Stored locally in this browser</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {posts.length === 0 ? (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                        No posts yet. Publish your first post on the left.
                      </div>
                    ) : (
                      posts.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-accent-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-neutral-900">{p.title}</div>
                              <div className="mt-1 text-xs text-neutral-500">
                                {p.category} · {p.dateLabel} · {p.readTime}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onDelete(p.id)}
                              className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                              aria-label="Delete post"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
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

