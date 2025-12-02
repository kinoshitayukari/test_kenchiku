import { BLOG_POSTS } from '../constants';
import { BlogPost, Inquiry } from '../types';

const SUPABASE_URL = 'https://jfbzwedjqkkmkdcneapf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnp3ZWRqcWtrbWtkY25lYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg1MTMsImV4cCI6MjA4MDIzNDUxM30.12v-vfCH51g16ymkzdx7EzfW5LDq4_0ltQOUsSE2J0Y';

const REST_URL = `${SUPABASE_URL}/rest/v1`;

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | undefined>;
};

const fetchFromSupabase = async <T>(
  path: string,
  { params, headers, ...init }: RequestOptions = {},
): Promise<T> => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${REST_URL}${path}${searchParams.toString() ? `?${searchParams}` : ''}`.replace(/\?$/, ''), {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return [] as T;
  }

  return response.json();
};

const seedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const inserted = await fetchFromSupabase<BlogPost[]>(
      '/blog_posts',
      {
        method: 'POST',
        body: JSON.stringify(BLOG_POSTS),
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation',
        },
      },
    );
    return inserted;
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
      const data = await fetchFromSupabase<BlogPost[]>(
        '/blog_posts',
        { params: { select: '*', order: 'date.desc' } },
      );

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
      const data = await fetchFromSupabase<BlogPost[]>(
        '/blog_posts',
        { params: { select: '*', id: `eq.${id}` } },
      );
      if (data.length === 0) return undefined;
      return normalizeBlogPost(data[0]);
    } catch (error) {
      console.error('Failed to fetch blog post', error);
      const local = BLOG_POSTS.find(p => p.id === id);
      return local ? normalizeBlogPost(local) : undefined;
    }
  },

  saveBlogPost: async (post: BlogPost): Promise<BlogPost> => {
    const postToSave = normalizeBlogPost(post);
    try {
      const [saved] = await fetchFromSupabase<BlogPost[]>(
        '/blog_posts',
        {
          method: 'POST',
          body: JSON.stringify(postToSave),
          headers: {
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
        },
      );
      return normalizeBlogPost(saved);
    } catch (error) {
      console.error('Failed to save blog post', error);
      return postToSave;
    }
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    try {
      await fetchFromSupabase('/blog_posts', {
        method: 'DELETE',
        params: { id: `eq.${id}` },
      });
    } catch (error) {
      console.error('Failed to delete blog post', error);
    }
  },

  // Inquiries
  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      const data = await fetchFromSupabase<Inquiry[]>(
        '/inquiries',
        { params: { select: '*', order: 'date.desc' } },
      );
      return data.map(normalizeInquiry);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
      return [];
    }
  },

  saveInquiry: async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>): Promise<Inquiry> => {
    const inquiryToSave = normalizeInquiry(inquiry);
    try {
      const [saved] = await fetchFromSupabase<Inquiry[]>(
        '/inquiries',
        {
          method: 'POST',
          body: JSON.stringify(inquiryToSave),
          headers: {
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
        },
      );
      return normalizeInquiry(saved);
    } catch (error) {
      console.error('Failed to save inquiry', error);
      return inquiryToSave;
    }
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status']): Promise<void> => {
    try {
      await fetchFromSupabase<Inquiry[]>(
        '/inquiries',
        {
          method: 'PATCH',
          params: { id: `eq.${id}` },
          body: JSON.stringify({ status }),
          headers: {
            Prefer: 'resolution=merge-duplicates',
          },
        },
      );
    } catch (error) {
      console.error('Failed to update inquiry status', error);
    }
  },

  deleteInquiry: async (id: string): Promise<void> => {
    try {
      await fetchFromSupabase('/inquiries', {
        method: 'DELETE',
        params: { id: `eq.${id}` },
      });
    } catch (error) {
      console.error('Failed to delete inquiry', error);
    }
  },
};
