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

const seedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(BLOG_POSTS, { onConflict: 'id' })
      .select('*');

    if (error) throw error;
    return data ?? BLOG_POSTS;
  } catch (error) {
    console.error('Failed to seed blog posts, falling back to defaults', error);
    return BLOG_POSTS;
  }
};

const normalizeBlogPost = (post: Partial<BlogPost>): BlogPost => ({
  id: post.id || crypto.randomUUID?.() || Date.now().toString(),
  title: post.title || '',
  excerpt: post.excerpt || '',
  date: post.date || new Date().toISOString().split('T')[0],
  readTime: post.readTime || '5分',
  category: post.category || 'その他',
  image: post.image || '',
  tags: post.tags || [],
  author: post.author,
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

export const storage = {
  // Blog Posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return seedBlogPosts();
      }

      return data.map(normalizeBlogPost);
    } catch (error) {
      console.error('Failed to fetch blog posts from Supabase', error);
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
      return normalizeBlogPost(data);
    } catch (error) {
      console.error('Failed to fetch blog post', error);
      const local = BLOG_POSTS.find(p => p.id === id);
      return local ? normalizeBlogPost(local) : undefined;
    }
  },

  saveBlogPost: async (post: BlogPost): Promise<BlogPost> => {
    const postToSave = normalizeBlogPost(post);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(postToSave, { onConflict: 'id' })
        .select('*')
        .single();

      if (error) throw error;
      return normalizeBlogPost(data);
    } catch (error) {
      console.error('Failed to save blog post', error);
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
