import { BlogPost } from '../types';

// Vercel で環境変数が未設定の場合も動作するよう、既定値に共有プロジェクトを設定
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://jfbzwedjqkkmkdcneapf.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnp3ZWRqcWtrbWtkY25lYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg1MTMsImV4cCI6MjA4MDIzNDUxM30.12v-vfCH51g16ymkzdx7EzfW5LDq4_0ltQOUsSE2J0Y';
const BLOG_TABLE = 'blog_posts';

interface SupabaseBlogRow {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  read_time?: string | null;
  category: string;
  image?: string | null;
  tags?: string[] | null;
  author_name?: string | null;
  author_avatar?: string | null;
  summary?: string | null;
  content?: string | null;
  checkpoints?: string[] | null;
}

const requireConfig = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SupabaseのURLとAnon Keyを環境変数に設定してください。');
  }
};

const getHeaders = () => ({
  apikey: SUPABASE_ANON_KEY!,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
});

const mapRowToBlogPost = (row: SupabaseBlogRow): BlogPost => ({
  id: row.id,
  title: row.title,
  excerpt: row.excerpt ?? '',
  date: row.date,
  readTime: row.read_time ?? '5分',
  category: row.category,
  image: row.image ?? '',
  tags: row.tags ?? [],
  author: row.author_name ? { name: row.author_name, avatar: row.author_avatar ?? '' } : undefined,
  summary: row.summary ?? '',
  content: row.content ?? '',
  checkpoints: row.checkpoints ?? []
});

export const blogService = {
  fetchPosts: async (): Promise<BlogPost[]> => {
    requireConfig();
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${BLOG_TABLE}?select=*&order=date.desc`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('ブログ記事の取得に失敗しました');
    }

    const data = await response.json();
    return (data as SupabaseBlogRow[]).map(mapRowToBlogPost);
  },

  fetchPostById: async (id: string): Promise<BlogPost | null> => {
    requireConfig();
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${BLOG_TABLE}?id=eq.${id}&select=*`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('ブログ記事の取得に失敗しました');
    }

    const data = (await response.json()) as SupabaseBlogRow[];
    return data[0] ? mapRowToBlogPost(data[0]) : null;
  },

  fetchRelatedPosts: async (category: string, excludeId: string, limit = 3): Promise<BlogPost[]> => {
    requireConfig();
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${BLOG_TABLE}?category=eq.${encodeURIComponent(category)}&id=neq.${encodeURIComponent(
        excludeId
      )}&order=date.desc&limit=${limit}&select=*`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('関連記事の取得に失敗しました');
    }

    const data = (await response.json()) as SupabaseBlogRow[];
    return data.map(mapRowToBlogPost);
  },

  savePost: async (post: BlogPost): Promise<void> => {
    requireConfig();
    const payload: SupabaseBlogRow = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      read_time: post.readTime,
      category: post.category,
      image: post.image,
      tags: post.tags,
      author_name: post.author?.name ?? null,
      author_avatar: post.author?.avatar ?? null,
      summary: post.summary ?? null,
      content: post.content ?? null,
      checkpoints: post.checkpoints ?? []
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${BLOG_TABLE}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('ブログ記事の保存に失敗しました');
    }
  },

  deletePost: async (id: string): Promise<void> => {
    requireConfig();
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${BLOG_TABLE}?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation'
        }
      }
    );

    if (!response.ok) {
      throw new Error('ブログ記事の削除に失敗しました');
    }
  }
};
