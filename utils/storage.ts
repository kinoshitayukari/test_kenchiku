import { Inquiry } from '../types';

const INQUIRY_STORAGE_KEY = 'tomoaki_inquiries';

export const storage = {
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