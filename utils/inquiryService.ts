import { Inquiry } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://jfbzwedjqkkmkdcneapf.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnp3ZWRqcWtrbWtkY25lYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg1MTMsImV4cCI6MjA4MDIzNDUxM30.12v-vfCH51g16ymkzdx7EzfW5LDq4_0ltQOUsSE2J0Y';

const INQUIRY_TABLE = 'contact_inquiries';

interface SupabaseInquiryRow {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  type?: string | null;
  budget?: string | null;
  message?: string | null;
  status?: 'new' | 'read' | 'replied' | null;
  created_at?: string | null;
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

const mapRowToInquiry = (row: SupabaseInquiryRow): Inquiry => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone ?? '',
  type: row.type ?? '',
  budget: row.budget ?? '',
  message: row.message ?? '',
  date: (row.created_at ?? '').split('T')[0] ?? '',
  status: row.status ?? 'new'
});

export const inquiryService = {
  fetchInquiries: async (): Promise<Inquiry[]> => {
    requireConfig();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${INQUIRY_TABLE}?select=*&order=created_at.desc`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('お問い合わせの取得に失敗しました');
    }

    const data = (await response.json()) as SupabaseInquiryRow[];
    return data.map(mapRowToInquiry);
  },

  saveInquiry: async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>): Promise<void> => {
    requireConfig();

    const payload: SupabaseInquiryRow = {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      type: inquiry.type,
      budget: inquiry.budget,
      message: inquiry.message,
      status: 'new'
    } as SupabaseInquiryRow;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${INQUIRY_TABLE}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('お問い合わせの送信に失敗しました');
    }
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status']): Promise<void> => {
    requireConfig();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${INQUIRY_TABLE}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('お問い合わせのステータス更新に失敗しました');
    }
  },

  deleteInquiry: async (id: string): Promise<void> => {
    requireConfig();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${INQUIRY_TABLE}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('お問い合わせの削除に失敗しました');
    }
  }
};
