import React, { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, CheckCircle, Circle } from 'lucide-react';
import { storage } from '../../utils/storage';
import { Inquiry } from '../../types';

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const fetched = await storage.getInquiries();
        setInquiries(fetched);
      } catch (err) {
        console.error(err);
        setError('お問い合わせの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: Inquiry['status']) => {
    const newStatus = currentStatus === 'new' ? 'read' : 'replied';
    await storage.updateInquiryStatus(id, newStatus);
    const refreshed = await storage.getInquiries();
    setInquiries(refreshed);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('本当に削除してもよろしいですか？')) {
      await storage.deleteInquiry(id);
      const refreshed = await storage.getInquiries();
      setInquiries(refreshed);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">お問い合わせ一覧</h2>

      <div className="grid gap-4">
        {isLoading && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">読み込み中...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500 bg-white rounded-lg">{error}</div>
        )}

        {!isLoading && !error && inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className={`bg-white p-6 rounded-lg shadow border-l-4 ${
              inquiry.status === 'new' ? 'border-brand-orange' : 
              inquiry.status === 'read' ? 'border-blue-400' : 'border-green-500'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold text-white ${
                    inquiry.status === 'new' ? 'bg-brand-orange' : 
                    inquiry.status === 'read' ? 'bg-blue-400' : 'bg-green-500'
                  }`}>
                    {inquiry.status === 'new' ? '未読' : inquiry.status === 'read' ? '確認済み' : '対応済み'}
                  </span>
                  <span className="text-xs text-gray-400">{inquiry.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{inquiry.name} 様</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusChange(inquiry.id, inquiry.status)}
                  className="text-sm px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                >
                  {inquiry.status === 'replied' ? <CheckCircle size={14} className="text-green-500"/> : <Circle size={14} />}
                  状態変更
                </button>
                <button 
                  onClick={() => handleDelete(inquiry.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <a href={`mailto:${inquiry.email}`} className="hover:text-brand-orange">{inquiry.email}</a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <a href={`tel:${inquiry.phone}`} className="hover:text-brand-orange">{inquiry.phone}</a>
              </div>
              <div className="md:col-span-2 flex gap-4">
                 <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">予算: {inquiry.budget}</span>
                 <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">種別: {inquiry.type}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>
        ))}

        {!isLoading && !error && inquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
            お問い合わせはまだありません。
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;