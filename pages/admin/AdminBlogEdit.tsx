import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../utils/blogService';
import { BlogPost } from '../../types';
import { BLOG_CATEGORIES } from '../../constants';

const AdminBlogEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'キッチン',
    image: 'https://picsum.photos/seed/new/800/500',
    tags: [],
    date: new Date().toISOString().split('T')[0],
    readTime: '5分',
    author: {
      name: '管理者',
      avatar: 'https://i.pravatar.cc/150?u=admin'
    },
    summary: '',
    checkpoints: []
  });

  const [checkpointsStr, setCheckpointsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      const fetchPost = async () => {
        try {
          const post = await blogService.fetchPostById(id);
          if (post) {
            setFormData(post);
            setCheckpointsStr(post.checkpoints?.join('\n') || '');
            setTagsStr(post.tags.join(', '));
            setError(null);
          } else {
            setError('記事が見つかりませんでした。');
          }
        } catch (err) {
          console.error(err);
          setError('記事の取得に失敗しました。Supabaseの設定をご確認ください。');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const checkpoints = checkpointsStr.split('\n').map(s => s.trim()).filter(s => s !== '');
    const tags = tagsStr.split(',').map(s => s.trim()).filter(s => s !== '');

    const postToSave = {
      ...formData,
      id: isEdit ? id! : Date.now().toString(),
      checkpoints,
      tags
    } as BlogPost;

    setSaving(true);
    try {
      await blogService.savePost(postToSave);
      setError(null);
      navigate('/admin/blog');
    } catch (err) {
      console.error(err);
      setError('ブログ記事の保存に失敗しました。Supabaseの設定やRLSポリシーを確認してください。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'ブログ記事編集' : '新規記事作成'}</h2>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-lg p-4 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
            >
              {BLOG_CATEGORIES.filter(c => c !== 'すべて').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公開日</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">アイキャッチ画像URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">抜粋 (一覧用)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              required
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">記事の要約 (詳細ページ上部)</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">本文 (HTML可)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none font-mono text-sm"
              placeholder="<p>ここに本文を入力...</p>"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">チェックポイント (改行で区切る)</label>
            <textarea
              value={checkpointsStr}
              onChange={(e) => setCheckpointsStr(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="ポイント1&#13;&#10;ポイント2"
            ></textarea>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">タグ (カンマ区切り)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="キッチン, リフォーム, 節約"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="px-6 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={saving}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded bg-brand-orange text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-60"
            disabled={saving || loading}
          >
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEdit;
