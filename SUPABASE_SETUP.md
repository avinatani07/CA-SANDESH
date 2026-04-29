# Supabase Blog Setup

## 1) Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 2) Database Schema (SQL)

Run this SQL in the Supabase SQL Editor:

```
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  title text not null,
  excerpt text not null,
  category text not null,
  date_label text not null,
  read_time text not null,
  content text not null,
  image_url text,
  tags text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.blog_posts add column if not exists legacy_id text;
alter table public.blog_posts add column if not exists image_url text;
alter table public.blog_posts add column if not exists tags text[] not null default '{}';
create unique index if not exists blog_posts_legacy_id_key on public.blog_posts (legacy_id) where legacy_id is not null;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.blog_posts enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read published posts"
on public.blog_posts
for select
using (published = true);

create policy "Admins can insert posts"
on public.blog_posts
for insert
to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "Admins can delete posts"
on public.blog_posts
for delete
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "Admins can update posts"
on public.blog_posts
for update
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

create policy "Users can check their admin status"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());
```

## 3) Create Your Admin Login

1. In Supabase Dashboard → Authentication → Users, create a user (email/password).
2. Copy that user’s UUID.
3. Insert it into `admin_users`:

```
insert into public.admin_users (user_id)
values ('YOUR_USER_UUID');
```

## 4) Blog Images (Supabase Storage)

1. In Supabase Dashboard → Storage, create a bucket named `blog-images` and set it to Public.
2. Run this SQL in the Supabase SQL Editor:

```
create policy "Public can read blog images"
on storage.objects
for select
using (bucket_id = 'blog-images');

create policy "Admins can upload blog images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-images'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);
```
