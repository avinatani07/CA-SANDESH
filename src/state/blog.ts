import seedData from '../data/blogSeed.json';
import { isSupabaseConfigured, requireSupabase } from './supabase';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  readTime: string;
  content: string;
  imageUrl?: string | null;
  tags?: string[];
  legacyId?: string | null;
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
  imageUrl: null,
  tags: [],
  legacyId: `seed_${idx + 1}`,
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
  image_url: string | null;
  tags: string[] | null;
  legacy_id: string | null;
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
    imageUrl: row.image_url,
    tags: row.tags ?? [],
    legacyId: row.legacy_id,
    createdAt: Date.parse(row.created_at),
  };
}

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as BlogPostRow[]).map(mapRowToPost);
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return seedPosts.find((p) => p.id === id) ?? null;
  }
  const supabase = requireSupabase();

  if (id.startsWith('seed_')) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('legacy_id', id)
      .eq('published', true)
      .maybeSingle();
    if (!error && data) return mapRowToPost(data as BlogPostRow);
    return seedPosts.find((p) => p.id === id) ?? null;
  }

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
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date_label: post.dateLabel,
      read_time: post.readTime,
      content: post.content,
      image_url: post.imageUrl ?? null,
      tags: post.tags ?? [],
      legacy_id: post.legacyId ?? null,
      published: true,
    })
    .select('*')
    .single();
  if (error || !data) return { ok: false, error: error?.message || 'Failed to publish post.' };
  return { ok: true, post: mapRowToPost(data as BlogPostRow) };
}

export async function upsertBlogPostByLegacyId(
  legacyId: string,
  post: Omit<BlogPost, 'id' | 'createdAt'>,
): Promise<{ ok: true; post: BlogPost } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: 'Supabase is not configured.' };
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(
      {
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        date_label: post.dateLabel,
        read_time: post.readTime,
        content: post.content,
        image_url: post.imageUrl ?? null,
        tags: post.tags ?? [],
        legacy_id: legacyId,
        published: true,
      },
      { onConflict: 'legacy_id' },
    )
    .select('*')
    .single();
  if (error || !data) return { ok: false, error: error?.message || 'Failed to save post.' };
  return { ok: true, post: mapRowToPost(data as BlogPostRow) };
}

export async function updateBlogPost(
  id: string,
  post: Omit<BlogPost, 'id' | 'createdAt'>,
): Promise<{ ok: true; post: BlogPost } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: 'Supabase is not configured.' };
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date_label: post.dateLabel,
      read_time: post.readTime,
      content: post.content,
      image_url: post.imageUrl ?? null,
      tags: post.tags ?? [],
      published: true,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) return { ok: false, error: error?.message || 'Failed to update post.' };
  return { ok: true, post: mapRowToPost(data as BlogPostRow) };
}

export async function removeBlogPost(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: 'Supabase is not configured.' };
  const supabase = requireSupabase();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { ok: false, error: error.message || 'Failed to delete post.' };
  return { ok: true };
}

export async function uploadBlogImage(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: 'Supabase is not configured.' };
  const supabase = requireSupabase();
  const nameParts = file.name.split('.');
  const ext = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'png';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage.from('blog-images').upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) return { ok: false, error: 'Failed to upload image.' };
  const { data: publicUrl } = supabase.storage.from('blog-images').getPublicUrl(data.path);
  return { ok: true, url: publicUrl.publicUrl };
}
