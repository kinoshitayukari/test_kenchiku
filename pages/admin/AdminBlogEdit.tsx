import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../utils/blogService';
import { BlogPost } from '../../types';
import { BLOG_CATEGORIES } from '../../constants';
import { geminiService } from '../../utils/geminiService';

const AdminBlogEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'キッチン',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
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
  const [generating, setGenerating] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [generationKeyword, setGenerationKeyword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('geminiApiKey');
      if (savedKey) {
        setGeminiApiKey(savedKey);
      }
    } catch (storageError) {
      console.error('Failed to load Gemini API key from storage', storageError);
    }

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

  const handleGenerateDraft = async () => {
    setGenerating(true);
    setError(null);

    try {
      const draft = await geminiService.generateBlogDraft(geminiApiKey, generationKeyword);
      setFormData(prev => {
        const next = { ...prev } as Partial<BlogPost>;

        if (draft.title) next.title = draft.title;
        if (draft.excerpt) next.excerpt = draft.excerpt;
        if (draft.summary) next.summary = draft.summary;
        if (draft.content) next.content = draft.content;
        if (draft.readTime) next.readTime = draft.readTime;
        if (draft.image) next.image = draft.image;
        if (!prev.date) {
          next.date = new Date().toISOString().split('T')[0];
        }

        return next;
      });

      if (draft.checkpoints?.length) {
        setCheckpointsStr(draft.checkpoints.join('\n'));
      }

      if (draft.tags?.length) {
        setTagsStr(draft.tags.join(', '));
      }

      try {
        localStorage.setItem('geminiApiKey', geminiApiKey);
      } catch (storageError) {
        console.error('Failed to save Gemini API key', storageError);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '記事の自動生成に失敗しました。');
    } finally {
      setGenerating(false);
    }
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

      <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Geminiで下書きを自動生成</h3>
            <p className="text-sm text-gray-500">キーワードを入力すると記事の叩きを作成します。APIキーはブラウザにのみ保存されます。</p>
          </div>
          <button
            type="button"
            onClick={handleGenerateDraft}
            disabled={generating || !geminiApiKey || !generationKeyword}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {generating ? '生成中...' : 'AIで下書きを作成'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gemini APIキー</label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="AIza..."
            />
            <p className="text-xs text-gray-400 mt-1">※ ブラウザにのみ保存され、サーバーには送信されません。</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">生成用キーワード</label>
            <input
              type="text"
              value={generationKeyword}
              onChange={(e) => setGenerationKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="例: キッチンリフォームのコツ"
            />
            <p className="text-xs text-gray-400 mt-1">キーワードに合わせたタイトル・本文・タグを提案します。</p>
          </div>
        </div>
      </div>

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
            <div className="grid md:grid-cols-2 gap-4">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={14}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-orange outline-none font-mono text-sm"
                placeholder="<h2>大見出し</h2>\n<p>段落...</p>\n<h3>小見出し</h3>\n<p>段落...</p>"
              ></textarea>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">プレビュー</p>
                    <p className="text-sm text-gray-600">見出しやリストのスタイルを確認できます</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">HTML対応</span>
                </div>
                <div
                  className="blog-preview-content text-gray-800 text-sm leading-7 space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: formData.content?.trim()
                      ? formData.content
                      : '<p class="text-gray-400">ここに本文のプレビューが表示されます。</p>'
                  }}
                />
              </div>
            </div>
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

      <style>{`
        .blog-preview-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          padding-bottom: 0.35rem;
          border-bottom: 3px solid #ea580c;
        }

        .blog-preview-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.35rem;
          border-left: 4px solid #ea580c;
          padding-left: 0.5rem;
        }

        .blog-preview-content h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-top: 0.85rem;
          margin-bottom: 0.25rem;
          color: #ea580c;
        }

        .blog-preview-content ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin-top: 0.35rem;
        }

        .blog-preview-content ol {
          list-style: decimal;
          padding-left: 1.25rem;
          margin-top: 0.35rem;
        }

        .blog-preview-content li {
          margin-bottom: 0.25rem;
        }

        .blog-preview-content p {
          margin: 0.35rem 0;
        }
      `}</style>
    </div>
  );
};

export default AdminBlogEdit;
