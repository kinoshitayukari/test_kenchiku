import React, { useState, useEffect } from 'react';
import { BLOG_CATEGORIES } from '../constants';
import { Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load posts from storage
    setPosts(storage.getBlogPosts());
  }, []);

  const filteredPosts = activeCategory === 'すべて' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16 pt-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">リフォームブログ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            リフォームに関する役立つ情報や、最新のトレンド、施工のポイントなどをお届けします
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-brand-orange text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <time>{post.date}</time>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-brand-orange transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                  <span className="text-brand-orange text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    続きを読む <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
           <div className="text-center py-20 text-gray-500">
             記事が見つかりませんでした。
           </div>
        )}
      </div>
    </div>
  );
};

export default Blog;