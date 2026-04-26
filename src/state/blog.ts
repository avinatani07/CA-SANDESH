import seedData from '../data/blogSeed.json';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  readTime: string;
  content: string;
  createdAt: number;
};

type SeedRow = { url: string; title: string; date: string; author: string; body: string };

export function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function makeExcerpt(body: string) {
  const firstPara = body.split('\n').find((l) => l.trim().length > 0) ?? '';
  const secondPara = body.split('\n').find((l, idx) => idx > 0 && l.trim().length > 0) ?? '';
  const candidate = firstPara.length < 40 ? secondPara : firstPara;
  return candidate.slice(0, 180);
}

export const seedPosts: BlogPost[] = (seedData as SeedRow[]).map((p, idx) => ({
  id: `seed_${idx + 1}`,
  title: p.title,
  excerpt: makeExcerpt(p.body),
  category: 'Blogs',
  dateLabel: p.date,
  readTime: estimateReadTime(p.body),
  content: p.body,
  createdAt: 0,
}));

const BLOG_STORAGE_KEY = 'jaiman_blog_posts_v1';

export function loadBlogPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BlogPost[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => typeof p?.id === 'string' && typeof p?.title === 'string');
  } catch {
    return [];
  }
}

export function getAllBlogPosts(): BlogPost[] {
  return [...loadBlogPosts(), ...seedPosts];
}

export function saveBlogPosts(posts: BlogPost[]) {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

export function addBlogPost(post: Omit<BlogPost, 'id' | 'createdAt'>): BlogPost {
  const next: BlogPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const existing = loadBlogPosts();
  saveBlogPosts([next, ...existing]);
  return next;
}

export function deleteBlogPost(id: string) {
  const existing = loadBlogPosts();
  saveBlogPosts(existing.filter((p) => p.id !== id));
}

