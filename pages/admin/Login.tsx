import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/blog');
    } else {
      setError('パスワードが間違っています');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">管理画面ログイン</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-orange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力 (admin123)"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-brand-orange text-white font-bold py-2 rounded hover:bg-orange-600 transition-colors"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;