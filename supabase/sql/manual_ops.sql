-- Supabase SQL Editor quick actions for blog_posts and inquiries tables
-- Run snippets individually in the SQL Editor to inspect or maintain data.

-- 1) Ensure tables exist (id as text so frontend can reuse UUIDs)
create table if not exists blog_posts (
  id text primary key,
  title text not null,
  excerpt text,
  content text,
  summary text,
  category text,
  tags text[],
  image text,
  readTime text,
  date date default current_date,
  author text,
  checkpoints jsonb
);

create table if not exists inquiries (
  id text primary key,
  name text not null,
  email text,
  phone text,
  type text,
  budget text,
  message text,
  status text default 'new',
  date date default current_date
);

-- (If you only need the seed, run this whole block so the table is created beforehand)
create table if not exists blog_posts (
  id text primary key,
  title text not null,
  excerpt text,
  content text,
  summary text,
  category text,
  tags text[],
  image text,
  readTime text,
  date date default current_date,
  author text,
  checkpoints jsonb
);

insert into blog_posts (id, title, excerpt, content, summary, category, tags, image, readTime, date)
values
  ('post-1', 'タイトル', '抜粋', '本文', 'サマリー', 'カテゴリ', '{リフォーム,水回り}', 'https://...', '5分', '2024-07-01')
on conflict (id) do update
set title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    summary = excluded.summary,
    category = excluded.category,
    tags = excluded.tags,
    image = excluded.image,
    readTime = excluded.readTime,
    date = excluded.date;

-- 3) Update an inquiry status
update inquiries
set status = 'resolved'
where id = 'REPLACE_WITH_INQUIRY_ID';

-- 4) Bulk delete old resolved inquiries
delete from inquiries
where status = 'resolved' and date < current_date - interval '90 days';

-- 5) Inspect latest entries
select * from blog_posts order by date desc limit 10;
select * from inquiries order by date desc limit 10;
