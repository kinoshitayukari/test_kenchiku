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

## 画像を追加したい場合（`public/` の活用）

デプロイやビルドを挟まずに配信したい画像は、プロジェクト直下に `public/` ディレクトリを作成してアップロードします。GitHub の Web UI から直接追加する場合は、`public/` に移動して **Add file > Upload files** で画像をドラッグ＆ドロップしてください。`src`/`pages` からはルート相対パス（例: `/images/example.png`）で参照できます。`public/images/` では半角英数＋ハイフンで、サイズが分かるファイル名（例: `hero-kitchen-1920w.webp`）にすると管理しやすいです。

## ブログ記事を GitHub からアップロードする運用に変更

ブログは Supabase ではなく GitHub に置いたファイルを読み込む方式に変更しました。以下の手順で記事を追加できます。

1. `public/blog/posts` に記事本文（HTML）ファイルを追加します。例: `public/blog/posts/kitchen-reform-guide.html`
2. `public/blog/posts.json` にメタデータを追記します。
   ```jsonc
   {
     "id": "my-new-post",
     "title": "タイトル",
     "excerpt": "一覧に表示する抜粋",
     "date": "2024-11-04",
     "readTime": "7分",
     "category": "キッチン",
     "image": "/blog/images/hero-my-new-post.webp", // もしくは外部URL
     "tags": ["キッチン", "リフォーム"],
     "author": { "name": "Tomoaki建築工房", "avatar": "/blog/images/avatar.png" },
     "summary": "詳細ページ上部の要約",
     "contentPath": "/posts/kitchen-reform-guide.html",
     "checkpoints": ["ポイント1", "ポイント2"]
   }
   ```
3. 記事や画像を GitHub に push すると、そのままサイトに反映されます。外部リポジトリの raw URL から配信したい場合は、環境変数 `VITE_GITHUB_BLOG_BASE_URL` にベース URL を設定してください（例: `https://raw.githubusercontent.com/your-org/your-repo/main/public/blog`）。

## Supabase セットアップ（お問い合わせデータ用）

お問い合わせデータは Supabase に保存します。以下の手順で設定してください。

1. `.env.local` に Supabase の環境変数を追加します。

   ```bash
   VITE_SUPABASE_URL=あなたのSupabaseプロジェクトURL（Vercel で環境変数を設定できない場合は下記既定値を利用できます）
   VITE_SUPABASE_ANON_KEY=Anonキー

   # 共有プロジェクトを使う場合の既定値（Vercel に環境変数を追加できないときの代替案）
   VITE_SUPABASE_URL=https://jfbzwedjqkkmkdcneapf.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnp3ZWRqcWtrbWtkY25lYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg1MTMsImV4cCI6MjA4MDIzNDUxM30.12v-vfCH51g16ymkzdx7EzfW5LDq4_0ltQOUsSE2J0Y
   ```

2. Supabase の SQL Editor でお問い合わせテーブルを作成します（フォーム送信・管理画面で利用）。

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

## 画像パス対応表（後でアップロードする際のメモ）

- `/images/kitchen-cost-hero.jpg`：費用ガイド記事のヒーローイメージ（完成イメージ）
- `/images/kitchen-cost-plan.jpg`：配管位置とレイアウト解説用の図解イメージ
- `/images/kitchen-cost-checklist.jpg`：チェックリストを示すイラストイメージ

