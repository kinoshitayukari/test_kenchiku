import { BlogPost, Inquiry } from '../types';
import { BLOG_POSTS } from '../constants';

const BLOG_STORAGE_KEY = 'tomoaki_blog_posts';
const INQUIRY_STORAGE_KEY = 'tomoaki_inquiries';

export const storage = {
  // Blog Posts
  getBlogPosts: (): BlogPost[] => {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!stored) {
      // Initialize with default data if empty
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(BLOG_POSTS));
      return BLOG_POSTS;
    }
    return JSON.parse(stored);
  },

  getBlogPost: (id: string): BlogPost | undefined => {
    const posts = storage.getBlogPosts();
    return posts.find(p => p.id === id);
  },

  saveBlogPost: (post: BlogPost) => {
    const posts = storage.getBlogPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post); // Add to top
    }
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  },

  deleteBlogPost: (id: string) => {
    const posts = storage.getBlogPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Inquiries
  getInquiries: (): Inquiry[] => {
    const stored = localStorage.getItem(INQUIRY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const inquiries = storage.getInquiries();
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(inquiries));
  },

  updateInquiryStatus: (id: string, status: Inquiry['status']) => {
    const inquiries = storage.getInquiries();
    const index = inquiries.findIndex(i => i.id === id);
    if (index >= 0) {
      inquiries[index].status = status;
      localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(inquiries));
    }
  },

  deleteInquiry: (id: string) => {
    const inquiries = storage.getInquiries();
    const filtered = inquiries.filter(i => i.id !== id);
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(filtered));
  }
};