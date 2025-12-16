import { BlogPost } from '../types';

interface GitHubBlogManifestItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  category: string;
  image: string;
  tags?: string[];
  author?: { name: string; avatar: string };
  summary?: string;
  contentPath?: string;
  checkpoints?: string[];
}

const BLOG_BASE_PATH = import.meta.env.VITE_GITHUB_BLOG_BASE_URL?.replace(/\/$/, '') || '/blog';

const resolvePath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const normalizedBase = BLOG_BASE_PATH.startsWith('/') ? BLOG_BASE_PATH : `/${BLOG_BASE_PATH}`;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const fetchManifest = async (): Promise<GitHubBlogManifestItem[]> => {
  const response = await fetch(resolvePath('/posts.json'), { cache: 'no-cache' });

  if (!response.ok) {
    throw new Error('GitHubからブログ一覧を取得できませんでした。');
  }

  return (await response.json()) as GitHubBlogManifestItem[];
};

const mapToBlogPost = (item: GitHubBlogManifestItem, content?: string): BlogPost => ({
  id: item.id,
  title: item.title,
  excerpt: item.excerpt,
  date: item.date,
  readTime: item.readTime ?? '5分',
  category: item.category,
  image: item.image,
  tags: item.tags ?? [],
  author: item.author,
  summary: item.summary,
  content,
  checkpoints: item.checkpoints ?? []
});

export const blogService = {
  fetchPosts: async (): Promise<BlogPost[]> => {
    const manifest = await fetchManifest();
    return manifest.map((item) => mapToBlogPost(item));
  },

  fetchPostById: async (id: string): Promise<BlogPost | null> => {
    const manifest = await fetchManifest();
    const item = manifest.find((entry) => entry.id === id);
    if (!item) return null;

    let content: string | undefined;
    if (item.contentPath) {
      const response = await fetch(resolvePath(item.contentPath));
      if (!response.ok) {
        throw new Error('記事本文の取得に失敗しました。GitHub上のファイルを確認してください。');
      }
      content = await response.text();
    }

    return mapToBlogPost(item, content);
  },

  fetchRelatedPosts: async (category: string, excludeId: string, limit = 3): Promise<BlogPost[]> => {
    const manifest = await fetchManifest();
    return manifest
      .filter((item) => item.category === category && item.id !== excludeId)
      .slice(0, limit)
      .map((item) => mapToBlogPost(item));
  },

  savePost: async () => {
    throw new Error('ブログ記事はGitHubにアップロードしたファイルで管理してください。');
  },

  deletePost: async () => {
    throw new Error('ブログ記事の削除はGitHub上のファイル操作で行ってください。');
  }
};
