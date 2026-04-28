import seedData from '../data/blogSeed.json';
import { isSupabaseConfigured, supabase } from './supabase';

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

type BlogPostRow = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date_label: string;
  read_time: string;
  content: string;
  created_at: string;
  published: boolean;
};

function mapRowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    dateLabel: row.date_label,
    readTime: row.read_time,
    content: row.content,
    createdAt: Date.parse(row.created_at),
  };
}

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as BlogPostRow[]).map(mapRowToPost);
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  if (id.startsWith('seed_')) return seedPosts.find((p) => p.id === id) ?? null;
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();
  if (error || !data) return null;
  return mapRowToPost(data as BlogPostRow);
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt'>): Promise<{ ok: true; post: BlogPost } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: 'Supabase is not configured.' };
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date_label: post.dateLabel,
      read_time: post.readTime,
      content: post.content,
      published: true,
    })
    .select('*')
    .single();
  if (error || !data) return { ok: false, error: error?.message || 'Failed to publish post.' };
  return { ok: true, post: mapRowToPost(data as BlogPostRow) };
}

export async function removeBlogPost(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: 'Supabase is not configured.' };
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { ok: false, error: error.message || 'Failed to delete post.' };
  return { ok: true };
}
