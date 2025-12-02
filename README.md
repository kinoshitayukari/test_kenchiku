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

## Supabase（手動運用メモ）

フロントエンドは Supabase の REST API を直接呼び出してブログ記事と問い合わせを読み書きしますが、ダッシュボードからも手動でメンテナンスできます。

### テーブル構成
- `blog_posts`
  - 主なカラム: `id (text, PK)`, `title`, `excerpt`, `content`, `summary`, `category`, `tags (text[] or json)`, `image`, `readTime`, `date`
- `inquiries`
  - 主なカラム: `id (text, PK)`, `name`, `email`, `phone`, `type`, `budget`, `message`, `status`, `date`

### ダッシュボードでの操作手順
1. [Supabase プロジェクト](https://jfbzwedjqkkmkdcneapf.supabase.co) にログインし、左メニューの **Table Editor** を開きます。
2. `blog_posts` や `inquiries` を選択。
   - 右上の **Insert** から新規行を追加できます。`id` は UUID をそのまま入力するか空欄でも自動生成されます。
   - 既存行をクリックして内容を編集、保存できます。
   - 複数削除はチェックボックス選択→ **Delete**。
3. SQL でまとめて投入・更新する場合は **SQL Editor** を使います。`supabase/sql/manual_ops.sql` にテーブル作成から初期データ投入、
   ステータス更新、古い問い合わせの一括削除、最新データの確認までよく使うクエリをまとめています。必要な行だけコピーして実行してください。
   - 初期投入のみ簡単に実行したい場合は以下を貼り付ければ OK です。
     ```sql
     insert into blog_posts (id, title, excerpt, content, summary, category, tags, image, readTime, date)
     values
       ('post-1', 'タイトル', '抜粋', '本文', 'サマリー', 'カテゴリ', '{リフォーム,水回り}', 'https://...', '5分', '2024-07-01')
     on conflict (id) do update set title = excluded.title;
     ```

### REST API で確認・操作する例
- 記事一覧取得
  ```bash
  curl 'https://jfbzwedjqkkmkdcneapf.supabase.co/rest/v1/blog_posts?select=*' \
    -H 'apikey: <anon_key>' -H 'Authorization: Bearer <anon_key>'
  ```
- 問い合わせステータス更新
  ```bash
  curl -X PATCH 'https://jfbzwedjqkkmkdcneapf.supabase.co/rest/v1/inquiries?id=eq.<id>' \
    -H 'apikey: <anon_key>' -H 'Authorization: Bearer <anon_key>' \
    -H 'Content-Type: application/json' \
    -d '{"status":"resolved"}'
  ```

> API キーをローテーションする場合は、`utils/storage.ts` の `SUPABASE_ANON_KEY` を新しい値に差し替えてください。
