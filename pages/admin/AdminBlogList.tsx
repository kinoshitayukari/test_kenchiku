import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { storage } from '../../utils/storage';
import { BlogPost } from '../../types';

const AdminBlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetched = await storage.getBlogPosts();
        setPosts(fetched);
      } catch (err) {
        console.error(err);
        setError('記事の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('本当に削除してもよろしいですか？')) {
      await storage.deleteBlogPost(id);
      const refreshed = await storage.getBlogPosts();
      setPosts(refreshed);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ブログ記事一覧</h2>
        <Link to="/admin/blog/new" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Plus size={18} />
          新規作成
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="p-4 border-b">タイトル</th>
              <th className="p-4 border-b">カテゴリ</th>
              <th className="p-4 border-b">公開日</th>
              <th className="p-4 border-b text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">読み込み中...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-red-500">{error}</td>
              </tr>
            )}
            {!isLoading && !error && posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold text-gray-800">{post.title}</div>
                  <div className="text-xs text-gray-400 truncate max-w-md">{post.excerpt}</div>
                </td>
                <td className="p-4">
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {post.category}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">{post.date}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      to={`/admin/blog/edit/${post.id}`} 
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && !error && posts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  記事がありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogList;