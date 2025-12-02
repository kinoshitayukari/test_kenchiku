<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17zAvXDMgmL6VrKjYpfFRgyRI2v4pvFRw

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase セットアップ

ブログ記事・お問い合わせデータは Supabase に保存します。以下の手順で設定してください。

1. `.env.local` に Supabase の環境変数を追加します。

   ```bash
   VITE_SUPABASE_URL=あなたのSupabaseプロジェクトURL（Vercel で環境変数を設定できない場合は下記既定値を利用できます）
   VITE_SUPABASE_ANON_KEY=Anonキー

   # 共有プロジェクトを使う場合の既定値（Vercel に環境変数を追加できないときの代替案）
   VITE_SUPABASE_URL=https://jfbzwedjqkkmkdcneapf.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnp3ZWRqcWtrbWtkY25lYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg1MTMsImV4cCI6MjA4MDIzNDUxM30.12v-vfCH51g16ymkzdx7EzfW5LDq4_0ltQOUsSE2J0Y
   ```

2. Supabase の SQL Editor でブログテーブルを作成します。

   ```sql
   create table if not exists public.blog_posts (
     id text primary key,
     title text not null,
     excerpt text not null,
     date date not null,
     read_time text,
     category text not null,
     image text,
     tags text[],
     author_name text,
     author_avatar text,
     summary text,
     content text,
     checkpoints text[],
     created_at timestamp with time zone default now()
   );

   alter table public.blog_posts enable row level security;

   create policy "Allow anon full access for admin UI" on public.blog_posts
   for all
   using (true)
   with check (true);
   ```

   ※ セキュリティ要件に応じてポリシーを調整してください。Anonキーでの保存/削除が必要なため、上記では簡易的に全操作を許可しています。

3. お問い合わせテーブルも SQL Editor から作成します（フォーム送信・管理画面で利用）。

   ```sql
   create extension if not exists "pgcrypto";

   create table if not exists public.contact_inquiries (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     email text not null,
     phone text,
     type text,
     budget text,
     message text,
     status text default 'new',
     created_at timestamp with time zone default now()
   );

   alter table public.contact_inquiries enable row level security;

   create policy "Allow anon full access for admin UI" on public.contact_inquiries
   for all
   using (true)
   with check (true);
   ```

4. 既定のリフォーム知識記事を Supabase に投入します（任意）。

   ```bash
   # 共有プロジェクトを使う場合はそのまま実行できます
   # 自分の Supabase を使う場合は VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を事前に設定
   npm run seed:blogs
   ```

   スクリプトは以下の6記事を `blog_posts` にアップサートします：

   - 失敗しないリフォーム計画の基本ステップ
   - 耐久性アップのための住宅チェックポイント
   - 断熱リフォームで快適さと光熱費を両立
   - キッチン・浴室・洗面のリフォーム動線
   - 耐震リフォームで守る家族の安全
   - リフォーム費用を抑える見積りの読み解き方
