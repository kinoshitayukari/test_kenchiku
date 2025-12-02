import { createClient } from './supabaseClient';

import { BLOG_POSTS } from '../constants';
import { BlogPost, Inquiry } from '../types';

const SUPABASE_URL = 'https://jfbzwedjqkkmkdcneapf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnp3ZWRqcWtrbWtkY25lYXBmIiwi\
cm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg1MTMsImV4cCI6MjA4MDIzNDUxM30.12v-vfCH51g16ymkzdx7EzfW5LDq4_0ltQOUsSE2J0Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

const serializeAuthor = (author?: BlogPost['author']) => {
  if (!author) return null;
  try {
    return JSON.stringify(author);
  } catch (error) {
    console.error('Failed to serialize author', error);
    return null;
  }
};

const deserializeAuthor = (author: BlogPost['author'] | string | null | undefined): BlogPost['author'] => {
  if (!author) return undefined;
  if (typeof author === 'string') {
    try {
      return JSON.parse(author) as BlogPost['author'];
    } catch (error) {
      console.warn('Failed to parse author JSON', error);
      return undefined;
    }
  }
  return author;
};

const serializeBlogPost = (post: BlogPost) => ({
  ...post,
  author: serializeAuthor(post.author),
});

const normalizeBlogPost = (post: Partial<BlogPost>): BlogPost => ({
  id: post.id || crypto.randomUUID?.() || Date.now().toString(),
  title: post.title || '',
  excerpt: post.excerpt || '',
  date: post.date || new Date().toISOString().split('T')[0],
  readTime: post.readTime || '5分',
  category: post.category || 'その他',
  image: post.image || '',
  tags: post.tags || [],
  author: deserializeAuthor(post.author),
  summary: post.summary,
  content: post.content,
  checkpoints: post.checkpoints || [],
});

const normalizeInquiry = (inquiry: Partial<Inquiry>): Inquiry => ({
  id: inquiry.id || crypto.randomUUID?.() || Date.now().toString(),
  name: inquiry.name || '',
  email: inquiry.email || '',
  phone: inquiry.phone || '',
  type: inquiry.type || '',
  budget: inquiry.budget || '',
  message: inquiry.message || '',
  date: inquiry.date || new Date().toISOString().split('T')[0],
  status: inquiry.status || 'new',
});

const BLOG_CACHE_KEY = 'blog_posts_cache';

const loadCachedPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cached = window.localStorage.getItem(BLOG_CACHE_KEY);
    if (!cached) return [];
    return (JSON.parse(cached) as BlogPost[]).map(normalizeBlogPost);
  } catch (error) {
    console.warn('Failed to load cached blog posts', error);
    return [];
  }
};

const saveCachedPosts = (posts: BlogPost[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(posts.map(serializeBlogPost)));
  } catch (error) {
    console.warn('Failed to cache blog posts', error);
  }
};

const seedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(BLOG_POSTS.map(serializeBlogPost), { onConflict: 'id' })
      .select('*');

    if (error) throw error;
    const normalized = (data ?? BLOG_POSTS).map(normalizeBlogPost);
    saveCachedPosts(normalized);
    return normalized;
  } catch (error) {
    console.error('Failed to seed blog posts, falling back to defaults', error);
    saveCachedPosts(BLOG_POSTS);
    return BLOG_POSTS;
  }
};

export const storage = {
  // Blog Posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const cached = loadCachedPosts();
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return seedBlogPosts();
      }

      const normalized = data.map(normalizeBlogPost);
      saveCachedPosts(normalized);
      return normalized;
    } catch (error) {
      console.error('Failed to fetch blog posts from Supabase', error);
      if (cached.length > 0) return cached;
      saveCachedPosts(BLOG_POSTS);
      return BLOG_POSTS;
    }
  },

  getBlogPost: async (id: string): Promise<BlogPost | undefined> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return undefined;
      const normalized = normalizeBlogPost(data);
      saveCachedPosts(
        [normalized, ...loadCachedPosts()].reduce<BlogPost[]>((acc, post) => {
          if (acc.some(p => p.id === post.id)) return acc;
          return [...acc, post];
        }, []),
      );
      return normalized;
    } catch (error) {
      console.error('Failed to fetch blog post', error);
      const local = [...loadCachedPosts(), ...BLOG_POSTS].find(p => p.id === id);
      return local ? normalizeBlogPost(local) : undefined;
    }
  },

  saveBlogPost: async (post: BlogPost): Promise<BlogPost> => {
    const postToSave = normalizeBlogPost(post);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(serializeBlogPost(postToSave), { onConflict: 'id' })
        .select('*')
        .single();

      if (error) throw error;
      const normalized = normalizeBlogPost(data);
      const cachedPosts = loadCachedPosts();
      const updated = [normalized, ...cachedPosts.filter(p => p.id !== normalized.id)];
      saveCachedPosts(updated);
      return normalized;
    } catch (error) {
      console.error('Failed to save blog post', error);
      const cachedPosts = loadCachedPosts();
      const updated = [postToSave, ...cachedPosts.filter(p => p.id !== postToSave.id)];
      saveCachedPosts(updated);
      return postToSave;
    }
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete blog post', error);
    }
    const cachedPosts = loadCachedPosts().filter(p => p.id !== id);
    saveCachedPosts(cachedPosts);
  },

  // Inquiries
  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return (data ?? []).map(normalizeInquiry);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
      return [];
    }
  },

  saveInquiry: async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>): Promise<Inquiry> => {
    const inquiryToSave = normalizeInquiry(inquiry);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .upsert(inquiryToSave, { onConflict: 'id' })
        .select('*')
        .single();

      if (error) throw error;
      return normalizeInquiry(data);
    } catch (error) {
      console.error('Failed to save inquiry', error);
      return inquiryToSave;
    }
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status']): Promise<void> => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update inquiry status', error);
    }
  },

  deleteInquiry: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete inquiry', error);
    }
  },
};
