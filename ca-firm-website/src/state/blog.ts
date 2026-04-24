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

