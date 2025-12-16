import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { PORTFOLIO_ITEMS, PLANS, FAQ_ITEMS, GOOGLE_FORM_URL, GOOGLE_FORM_EMBED_URL } from '../constants';
import { Calculator, ShieldCheck, ChevronDown, ChevronUp, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const featureShots = [
    {
      title: 'キッチンリフォーム',
      description: '開放的なアイランドキッチンで家族団らんの時間をもっと快適に。',
      image: '/images/example_kichen.jpg',
    },
    {
      title: '浴室リフォーム',
      description: 'ホテルライクなバスルームで一日の疲れを癒やすリラックスタイムを。',
      image: '/images/example_water.jpg',
    },
    {
      title: 'トイレリフォーム',
      description: '収納と間接照明を組み合わせた、清潔感のあるパウダールーム。',
      image: '/images/example_toilet.jpg',
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] md:h-[800px] bg-[#fdfbf7] flex items-center pt-20">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10 order-2 md:order-1">
            <div className="inline-block bg-white px-4 py-2 rounded-full border border-orange-100 mb-6 shadow-sm">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <HomeIcon size={16} className="text-brand-orange" />
                神戸三田エリア専門
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-gray-900 mb-6">
              大手の半額以下で<br />
              <span className="relative">
                理想の住まいを
                <span className="absolute bottom-1 left-0 w-full h-3 bg-brand-orange/20 -z-10"></span>
              </span>
              <br />
              実現します
            </h1>
            <p className="text-gray-600 mb-10 leading-relaxed max-w-lg">
              仲介業者を通さない直接施工だから、大手リフォーム会社の半額以下を実現。
              神戸三田エリアに密着した丁寧な対応で、お客様の理想を形にします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg text-center">
                無料見積もり依頼
              </button>
             <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 rounded-full font-bold text-gray-700 hover:text-brand-orange transition-all flex items-center justify-center gap-2 group">
                施工事例を見る
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="relative order-1 md:order-2 h-[400px] md:h-[600px]">
             {/* Decorative Background blob */}
             <div className="absolute top-0 right-0 w-full h-full bg-orange-100 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] opacity-50 blur-3xl -z-10"></div>

             {/* Hero Image */}
            <img
              src="/images/hero-livingroom-1920w. webp.jpg"
              alt="Spacious and bright renovated kitchen space"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
             
             {/* Floating Badge */}
             <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block max-w-[200px]">
               <p className="text-xs text-gray-500 mb-1">施工満足度</p>
               <div className="flex items-end gap-1">
                 <span className="text-3xl font-bold text-brand-orange">98</span>
                 <span className="text-sm font-bold text-gray-700 mb-1">%</span>
               </div>
               <p className="text-[10px] text-gray-400 mt-1">※自社アンケート調べ</p>
             </div>
          </div>
        </div>
      </section>

      {/* Water-area Featured Shots */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-brand-orange mb-2">水回りのリフォーム例</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">キッチン・浴室・トイレの最新施工イメージ</h2>
              <p className="text-gray-600 mt-3">明るく上質な空間づくりをイメージいただける実例写真をピックアップしました。</p>
            </div>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="self-start inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-200 text-sm font-semibold hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              相談してみる
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureShots.map((shot) => (
              <div key={shot.title} className="group bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={shot.image}
                    alt={shot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{shot.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{shot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="私たちについて" 
            subTitle="神戸三田エリアに根ざして30年" 
            centered={false}
          />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 leading-8 mb-6">
                私たちは神戸三田エリアに根ざし、30年以上にわたってお客様の住まいづくりをサポートしてきました。
                地域の気候や住宅事情を熟知し、一軒一軒に最適なリフォームプランをご提案いたします。
              </p>
              <p className="text-gray-600 leading-8 mb-8">
                仲介業者を通さない直接施工により、大手リフォーム会社の半額以下という圧倒的なコストパフォーマンスを実現。
                品質を落とすことなく、お客様のご予算内で理想の住まいを形にします。施工後も5年間の保証とアフターサービスで、安心をお届けします。
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-6 items-start p-6 rounded-2xl bg-[#fdfbf7] hover:shadow-md transition-shadow">
                <div className="bg-brand-orange text-white p-4 rounded-full shrink-0">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">仲介手数料0円</h3>
                  <p className="text-sm text-gray-500">直接施工で中間マージンなし。無駄なコストを徹底的にカットします。</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start p-6 rounded-2xl bg-[#fdfbf7] hover:shadow-md transition-shadow">
                <div className="bg-brand-orange text-white p-4 rounded-full shrink-0">
                  <HomeIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">地域密着30年</h3>
                  <p className="text-sm text-gray-500">神戸三田エリアを知り尽くした実績。地域の特性に合わせた提案が可能です。</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start p-6 rounded-2xl bg-[#fdfbf7] hover:shadow-md transition-shadow">
                <div className="bg-brand-orange text-white p-4 rounded-full shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">安心の保証制度</h3>
                  <p className="text-sm text-gray-500">施工後5年間の充実保証。アフターフォローも万全の体制です。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-[#fdfbf7]">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="施工実績" subTitle="神戸三田エリアで300件以上の実績" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {PORTFOLIO_ITEMS.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-200 text-xs">{item.description}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4 mb-4">
                     <span className="text-gray-500">施工費用</span>
                     <span className="font-bold text-gray-900">{item.details.cost}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">工期</span>
                     <span className="font-medium text-gray-900">{item.details.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-orange border-b border-gray-600 hover:border-brand-orange pb-1 transition-colors">
              すべての施工事例を見る <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="料金・プラン" subTitle="大手の半額以下、明朗会計でご提供" />

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative rounded-3xl p-8 border-2 transition-transform hover:-translate-y-2 duration-300 ${plan.isPopular ? 'border-brand-orange bg-orange-50/10' : 'border-gray-100 bg-white'}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                    人気No.1
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${plan.isPopular ? 'bg-orange-100' : 'bg-gray-50'}`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold font-serif text-gray-900">{plan.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-8 pb-8 border-b border-gray-100">{plan.subTitle}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <Check size={16} className="text-brand-orange shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}
                  className={`w-full py-3 rounded-full font-bold transition-colors ${plan.isPopular ? 'bg-brand-orange text-white hover:bg-orange-700' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                >
                  詳しく見る
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-8">※表示価格は標準的な施工の目安です。詳細はお見積もりにてご確認ください。</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#fdfbf7]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <SectionTitle title="よくある質問" subTitle="お客様からよくいただくご質問" />
          
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button 
                  className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-gray-800">{item.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="text-brand-orange shrink-0" />
                  ) : (
                    <ChevronDown className="text-gray-400 shrink-0" />
                  )}
                </button>
                <div 
                  className={`px-8 transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 leading-relaxed text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">無料見積もり・ご相談</h2>
            <p className="text-gray-600 text-sm">まずはお気軽にご相談ください。神戸三田エリアなら即日対応可能です</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#fdfbf7] border border-orange-100 rounded-xl p-6 text-sm text-gray-700">
              <p className="mb-2">以下のフォームにご入力ください。送信後は担当者より24時間以内にご連絡いたします。</p>
              <p>
                もしフォームが表示されない場合は、
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-orange underline"
                >
                  こちらのページ
                </a>
                から直接アクセスできます。
              </p>
            </div>
            <div className="aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-white">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                className="w-full h-full"
                allowFullScreen
                title="お問い合わせフォーム"
              ></iframe>
            </div>
            <div className="text-center">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors shadow-md"
              >
                フォームを別タブで開く
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;