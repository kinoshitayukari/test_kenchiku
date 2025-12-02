import React, { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, CheckCircle, Circle } from 'lucide-react';
import { inquiryService } from '../../utils/inquiryService';
import { Inquiry } from '../../types';

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiryService.fetchInquiries();
      setInquiries(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('お問い合わせの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: Inquiry['status']) => {
    const newStatus = currentStatus === 'new' ? 'read' : 'replied';
    try {
      await inquiryService.updateInquiryStatus(id, newStatus);
      setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    } catch (err) {
      console.error(err);
      alert('ステータスの更新に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('本当に削除してもよろしいですか？')) return;

    try {
      await inquiryService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">お問い合わせ一覧</h2>

      {error && <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 p-4 text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">読み込み中...</div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
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

          {inquiries.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
              お問い合わせはまだありません。
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;