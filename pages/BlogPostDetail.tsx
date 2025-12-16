import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Check, ChevronRight, Twitter, Facebook, Linkedin, ArrowRight, Lightbulb } from 'lucide-react';
import { blogService } from '../utils/blogService';
import { BlogPost } from '../types';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      window.scrollTo(0, 0);
      setLoading(true);
      try {
        const fetchedPost = await blogService.fetchPostById(id);
        if (!fetchedPost) {
          setError('記事が見つかりませんでした。');
          setPost(undefined);
          setRelatedPosts([]);
          return;
        }

        setPost(fetchedPost);
        setError(null);

        const related = await blogService.fetchRelatedPosts(fetchedPost.category, fetchedPost.id);
        setRelatedPosts(related);
      } catch (err) {
        console.error(err);
        setError('記事の読み込みに失敗しました。GitHub上の投稿ファイルを確認してください。');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] text-gray-500">
        読み込み中です...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || '記事が見つかりませんでした'}</h2>
          <Link to="/blog" className="text-brand-orange underline">ブログ一覧に戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-20">

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-orange transition-colors">ホーム</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link to="/blog" className="hover:text-brand-orange transition-colors">ブログ</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-gray-900 font-medium">{post.title}</span>
        </div>
      </div>

      <article className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Header Section */}
        <div className="mb-8">
          <span className="inline-block bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.author && (
              <div className="flex items-center gap-2">
                <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                <span className="font-medium text-gray-900">{post.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-4 border-l border-gray-300 pl-4">
              <time>{post.date}</time>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-lg mb-12 aspect-video">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Summary Box */}
        {post.summary && (
          <div className="bg-orange-50 border-l-4 border-brand-orange p-6 md:p-8 rounded-r-xl mb-12">
            <p className="text-gray-700 leading-relaxed font-medium">
              {post.summary}
            </p>
          </div>
        )}

        {/* Main Content */}
        <div
          className="article-content prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12 space-y-12"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        >
        </div>

        {/* Checkpoints Box */}
        {post.checkpoints && post.checkpoints.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 via-white to-white rounded-3xl p-8 mb-16 shadow-md border border-orange-100">
            <div className="flex items-center gap-3 mb-6 text-brand-orange">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-inner border border-orange-100 flex items-center justify-center">
                <Lightbulb className="fill-current" size={22} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase">Checklist</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900">リフォームのポイント</h3>
              </div>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              {post.checkpoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white/70 border border-orange-100 rounded-2xl p-4 shadow-sm">
                  <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1.5 shrink-0">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-gray-800 font-semibold leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conclusion / Summary Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">まとめ</h2>
          <p className="leading-loose text-gray-700">
            リフォームは人生でそう何度も経験することではありません。だからこそ、正しい知識を持って計画を進めることが成功の鍵となります。
            <br />
            まずは理想の暮らしをイメージし、信頼できるパートナーを見つけることから始めましょう。私たちは、お客様一人ひとりの想いに寄り添い、最適なプランをご提案させていただきます。
          </p>
        </div>

        {/* Tags & Share */}
        <div className="border-t border-b border-gray-200 py-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-600">この記事をシェア :</span>
              <button className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Twitter size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Facebook size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Linkedin size={18} />
              </button>
            </div>
          </div>
        </div>

      </article>

      {/* Related Articles */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h3 className="text-2xl font-serif font-bold mb-8">関連記事</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.length > 0 ? (
              relatedPosts.map(related => (
                <div
                  key={related.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/blog/${related.id}`)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-gray-400 mb-2 block">{related.date}</span>
                    <h4 className="font-bold text-gray-900 group-hover:text-brand-orange transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-3 text-gray-500 text-sm">関連記事はありません。</div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 md:px-6 mt-16">
        <div className="bg-brand-dark rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
           {/* Decorative bg */}
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black opacity-50 z-0"></div>
           <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">理想の住まいを<br className="md:hidden"/>一緒に作りませんか？</h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                経験豊富なスタッフが、あなたのライフスタイルに合わせた最適なリフォームプランをご提案します。
                まずは無料相談からお気軽にお問い合わせください。
              </p>
              <button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 100);
                }}
                className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg inline-flex items-center gap-2"
              >
                無料見積もりを依頼する <ArrowRight size={18} />
              </button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default BlogPostDetail;
