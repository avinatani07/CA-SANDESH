import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Link2, Linkedin, MessageCircle, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchBlogPostById, fetchPublishedBlogPosts, seedPosts } from '../state/blog';
import type { BlogPost } from '../state/blog';

export default function BlogPostPage({ postId }: { postId: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchBlogPostById(postId).then((found) => {
      if (!isMounted) return;
      setPost(found);
      setIsLoading(false);
      window.scrollTo(0, 0);
    });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  useEffect(() => {
    setShareUrl(window.location.href);
    setCopyState('idle');
  }, [postId]);

  useEffect(() => {
    if (!post) return;
    let isMounted = true;

    const load = async () => {
      const userPosts = await fetchPublishedBlogPosts();
      const overrides = new Map<string, BlogPost>();
      const standalone: BlogPost[] = [];

      for (const p of userPosts) {
        if (p.legacyId) overrides.set(p.legacyId, p);
        else standalone.push(p);
      }

      const mergedSeeds = seedPosts.map((seed) => overrides.get(seed.id) ?? seed);
      const combined = [...standalone, ...mergedSeeds].sort((a, b) => b.createdAt - a.createdAt);

      const currentKey = post.legacyId ?? post.id;
      const candidates = combined.filter((p) => (p.legacyId ?? p.id) !== currentKey);
      const sameCategory = candidates.filter((p) => p.category === post.category);
      const fallback = candidates.filter((p) => p.category !== post.category);
      const picks = [...sameCategory, ...fallback].slice(0, 3);

      if (!isMounted) return;
      setRelatedPosts(picks);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [post]);

  const shareLinks = useMemo(() => {
    const url = shareUrl || window.location.href;
    const title = post?.title ?? '';
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(`${title} - ${url}`);
    return {
      url,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };
  }, [post?.title, shareUrl]);

  const seoTags = useMemo(() => {
    const base = [
      'Chartered Accountants',
      'CA Firm',
      'India',
      'Income Tax',
      'GST',
      'Tax Filing',
      'Accounting',
      'Auditing',
      'Compliance',
      'Business Advisory',
      'Virtual CFO',
      'Wealth Planning',
    ];
    const extras = [...(post?.tags ?? []), post?.category].filter((t): t is string => Boolean(t));
    const unique = Array.from(new Set([...extras, ...base]));
    return unique.slice(0, 8);
  }, [post?.category, post?.tags]);

  useEffect(() => {
    if (!post) return;

    const prevTitle = document.title;
    const prevMeta = new Map<string, string | null>();
    const prevLink = new Map<string, string | null>();

    function getOrCreateMeta(selector: string, attrs: Record<string, string>) {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      return el;
    }

    function upsertMetaByName(name: string, content: string) {
      const selector = `meta[name="${name}"]`;
      const existing = document.head.querySelector<HTMLMetaElement>(selector);
      prevMeta.set(selector, existing?.getAttribute('content') ?? null);
      const el = getOrCreateMeta(selector, { name });
      el.setAttribute('content', content);
    }

    function upsertMetaByProperty(property: string, content: string) {
      const selector = `meta[property="${property}"]`;
      const existing = document.head.querySelector<HTMLMetaElement>(selector);
      prevMeta.set(selector, existing?.getAttribute('content') ?? null);
      const el = getOrCreateMeta(selector, { property });
      el.setAttribute('content', content);
    }

    function upsertLink(rel: string, href: string) {
      const selector = `link[rel="${rel}"]`;
      const existing = document.head.querySelector<HTMLLinkElement>(selector);
      prevLink.set(selector, existing?.getAttribute('href') ?? null);
      let el = existing;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    const url = shareLinks.url || window.location.href;
    const title = `${post.title} | Jaiman & Company Blog`;
    const description = post.excerpt || 'Tax, GST, accounting, and compliance insights by Jaiman & Company, Chartered Accountants.';
    const image = post.imageUrl || 'https://www.jaimanco.in/jaimanco-logo.png';

    document.title = title;

    upsertMetaByName('description', description);
    upsertMetaByName('keywords', seoTags.join(', '));

    upsertMetaByProperty('og:type', 'article');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', url);
    upsertMetaByProperty('og:image', image);

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', image);

    upsertMetaByProperty('article:section', post.category);

    document.head.querySelectorAll('meta[property="article:tag"][data-jaiman="tag"]').forEach((el) => el.remove());
    for (const tag of seoTags) {
      const el = document.createElement('meta');
      el.setAttribute('property', 'article:tag');
      el.setAttribute('content', tag);
      el.setAttribute('data-jaiman', 'tag');
      document.head.appendChild(el);
    }

    upsertLink('canonical', url);

    const jsonLdId = 'jaiman-jsonld-blog';
    document.getElementById(jsonLdId)?.remove();
    const jsonLd = document.createElement('script');
    jsonLd.id = jsonLdId;
    jsonLd.type = 'application/ld+json';
    jsonLd.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      image: image ? [image] : undefined,
      keywords: seoTags.join(', '),
      articleSection: post.category,
      author: { '@type': 'Organization', name: 'Jaiman & Company' },
      publisher: { '@type': 'Organization', name: 'Jaiman & Company', logo: { '@type': 'ImageObject', url: 'https://www.jaimanco.in/jaimanco-logo.png' } },
      mainEntityOfPage: url,
      url,
    });
    document.head.appendChild(jsonLd);

    return () => {
      document.title = prevTitle;
      for (const [selector, content] of prevMeta.entries()) {
        const el = document.head.querySelector<HTMLMetaElement>(selector);
        if (!el) continue;
        if (content === null) el.remove();
        else el.setAttribute('content', content);
      }
      for (const [selector, href] of prevLink.entries()) {
        const el = document.head.querySelector<HTMLLinkElement>(selector);
        if (!el) continue;
        if (href === null) el.remove();
        else el.setAttribute('href', href);
      }
      document.head.querySelectorAll('meta[property="article:tag"][data-jaiman="tag"]').forEach((el) => el.remove());
      document.getElementById(jsonLdId)?.remove();
    };
  }, [post, seoTags, shareLinks.url]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLinks.url);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1600);
    } catch {
      setCopyState('failed');
      window.setTimeout(() => setCopyState('idle'), 1600);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-600">Loading…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Post not found</h2>
        <a href="/" className="text-primary-500 hover:text-primary-600 flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-neutral-100 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </a>
        </div>
      </div>

      <section className="relative overflow-hidden">
        {post.imageUrl ? (
          <>
            <img src={post.imageUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-neutral-950/55" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500" />
        )}

        <div className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                <span>{post.category}</span>
                <span className="opacity-60">•</span>
                <span className="opacity-90">{post.readTime}</span>
              </div>
              <h1 className="mt-5 text-3xl md:text-5xl font-bold text-white font-heading leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 text-sm text-white/80">{post.dateLabel}</div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 max-w-4xl">
        <div className="mb-10 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-neutral-800">Share this post</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-accent-400 hover:text-accent-600 transition-colors"
              >
                <Link2 size={16} />
                {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy link'}
              </button>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-accent-400 hover:text-accent-600 transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-accent-400 hover:text-accent-600 transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-heading prose-p:leading-relaxed prose-blockquote:border-primary-500 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {(post.tags ?? []).length > 0 && (
          <section className="mt-10">
            <div className="text-sm font-bold text-neutral-900 font-heading">Tags</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(post.tags ?? []).map((t) => (
                <span key={t} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-neutral-100 pt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-neutral-900 font-heading">Related insights</h2>
              <a
                href="/#blog"
                className="text-sm font-semibold text-primary-600 hover:text-accent-600 transition-colors"
              >
                View all
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <a
                  key={p.legacyId ?? p.id}
                  href={`/?post=${p.legacyId ?? p.id}`}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="h-36 w-full object-cover" loading="lazy" />}
                  <div className="p-5">
                    <div className="text-xs font-semibold text-neutral-500">{p.category}</div>
                    <div className="mt-2 text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {p.title}
                    </div>
                    <div className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.excerpt}</div>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:text-accent-600 transition-colors">
                      Read more <ArrowRight size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
