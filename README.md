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

ブログ記事は Supabase に保存します。以下の手順で設定してください。

1. `.env.local` に Supabase の環境変数を追加します。

   ```bash
   VITE_SUPABASE_URL=あなたのSupabaseプロジェクトURL
   VITE_SUPABASE_ANON_KEY=Anonキー
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
