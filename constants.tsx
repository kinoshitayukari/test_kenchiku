import React from 'react';
import { NavItem, PortfolioItem, PlanItem, BlogPost, FaqItem } from './types';
import { Home, Bath, PaintBucket, Wrench, Calculator, ShieldCheck, MapPin } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: '会社概要', href: '/#about' },
  { label: '施工実績', href: '/#portfolio' },
  { label: '料金・プラン', href: '/#plans' },
  { label: 'ブログ', href: '/blog' },
  { label: 'よくある質問', href: '/#faq' },
  { label: 'お問い合わせ', href: '/#contact' },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'キッチンリフォーム',
    image: 'https://images.unsplash.com/photo-1616628182501-237f6f84255d?auto=format&fit=crop&w=1200&q=80',
    category: 'kitchen',
    description: '築25年の戸建て、工期2週間',
    details: {
      type: '戸建て',
      period: '2週間',
      cost: '120万円'
    }
  },
  {
    id: '2',
    title: '浴室リフォーム',
    image: 'https://images.unsplash.com/photo-1582719478171-2f2df4f0b76d?auto=format&fit=crop&w=1200&q=80',
    category: 'bath',
    description: 'マンション、工期10日',
    details: {
      type: 'マンション',
      period: '10日',
      cost: '95万円'
    }
  },
  {
    id: '3',
    title: 'リビングリフォーム',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    category: 'living',
    description: '戸建て全面改装、工期3週間',
    details: {
      type: '戸建て',
      period: '3週間',
      cost: '145万円'
    }
  },
  {
    id: '4',
    title: '外壁塗装',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    category: 'exterior',
    description: '戸建て、工期1週間',
    details: {
      type: '戸建て',
      period: '1週間',
      cost: '85万円'
    }
  },
  {
    id: '5',
    title: 'トイレリフォーム',
    image: 'https://images.unsplash.com/photo-1616594039964-7e07c48f3a59?auto=format&fit=crop&w=1200&q=80',
    category: 'toilet',
    description: 'マンション、工期5日',
    details: {
      type: 'マンション',
      period: '5日',
      cost: '25万円'
    }
  },
  {
    id: '6',
    title: '和室リフォーム',
    image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&q=80',
    category: 'japanese',
    description: '戸建て、工期2週間',
    details: {
      type: '戸建て',
      period: '2週間',
      cost: '78万円'
    }
  },
];

export const PLANS: PlanItem[] = [
  {
    id: 'water',
    title: '水回りリフォーム',
    price: '40万円~',
    subTitle: 'キッチン・浴室・トイレ',
    features: [
      '最新設備への交換',
      '配管工事込み',
      '5年保証付き'
    ],
    icon: <Wrench className="w-6 h-6 text-brand-orange" />
  },
  {
    id: 'living',
    title: 'リビング・居室',
    price: '80万円~',
    subTitle: 'フローリング・壁紙・照明',
    features: [
      '床材・壁紙の全面張替え',
      '照明・コンセント増設',
      '間取り変更相談可'
    ],
    icon: <Home className="w-6 h-6 text-brand-orange" />,
    isPopular: true
  },
  {
    id: 'exterior',
    title: '外壁・屋根',
    price: '90万円~',
    subTitle: '塗装・防水工事',
    features: [
      '高耐久塗料使用',
      '防水・断熱効果向上',
      '足場代込み'
    ],
    icon: <PaintBucket className="w-6 h-6 text-brand-orange" />
  }
];

// Sample content as HTML string
const sampleContentHtml = `
  <p class="mb-8 leading-loose text-gray-700">
    キッチンは毎日使う場所だからこそ、リフォームによる満足度が非常に高い空間です。しかし、デザインや機能の選択肢が多く、どのように決めれば良いか迷ってしまう方も少なくありません。
    <br /><br />
    近年では、対面式キッチンへの変更や、パントリーの設置、タッチレス水栓の導入などが人気ですが、最も大切なのは「ご家族のライフスタイルに合っているか」という点です。
  </p>

  <h2 class="text-2xl font-bold text-gray-900 mb-6 mt-12">なぜキッチンリフォームが必要なのか</h2>
  <p class="mb-6 leading-loose text-gray-700">
    築年数が経過すると、設備の老朽化だけでなく、ライフスタイルの変化によって「使いにくさ」を感じることが増えてきます。例えば、子供が成長して一緒にお料理をするようになったり、収納が足りなくなって物が溢れてしまったり。
    <br /><br />
    最新のキッチンは、掃除のしやすさや収納力が格段に向上しています。リフォームを行うことで、家事の時間を短縮し、家族との時間をより豊かにすることができます。
  </p>

  <h2 class="text-2xl font-bold text-gray-900 mb-6 mt-12">具体的な改善ポイント</h2>
  <p class="mb-8 leading-loose text-gray-700">
    実際の施工事例から見えてくる、多くの人が「やってよかった」と感じる改善ポイントをご紹介します。特に、動線の見直しと収納の工夫は、日々のストレスを劇的に減らす効果があります。
  </p>
`;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'キッチンリフォームで失敗しないための5つのポイント',
    excerpt: 'キッチンリフォームは大きな投資です。後悔しないために押さえておくべき重要なポイントを解説します。',
    date: '2025-01-15',
    readTime: '5分',
    category: 'キッチン',
    tags: ['キッチン', '失敗しない', 'ポイント'],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: '佐藤 健太',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    },
    summary: 'キッチンリフォームを始める前に理解しておくべき基本的な概念と、実践に役立つ5つの重要なポイントを解説します。予算の考え方から業者の選び方まで、初心者の方でも安心して進められるガイドです。',
    content: sampleContentHtml,
    checkpoints: [
      '現在の不満点を具体的にリストアップする',
      '「見せる収納」と「隠す収納」のバランスを考える',
      '作業スペースの高さと通路幅を確認する',
      'コンセントの位置と数を計画段階で決める',
      '将来のメンテナンス費用も考慮に入れる'
    ]
  },
  {
    id: '2',
    title: '浴室リフォームの最新トレンド2025',
    excerpt: '2025年の浴室リフォームで人気の設備やデザインをご紹介。快適なバスタイムを実現するヒントが満載です。',
    date: '2025-01-10',
    readTime: '4分',
    category: '浴室',
    tags: ['浴室', 'トレンド', '2025'],
    image: 'https://images.unsplash.com/photo-1617099390840-9b0e4d52f7e3?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: '田中 美咲',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    summary: '最新のユニットバス事情から、人気のお風呂機能まで徹底解説。保温性能の向上や、お掃除ラクラク機能など、毎日の入浴が楽しみになる最新トレンドをご紹介します。',
    content: sampleContentHtml,
    checkpoints: [
      '断熱性能の高い浴槽を選ぶ',
      '浴室乾燥機の設置を検討する',
      '床材は滑りにくく乾きやすいものを',
      '手すりの設置で将来のバリアフリーに対応',
      '照明の色温度でリラックス効果を高める'
    ]
  },
  {
    id: '3',
    title: '外壁塗装のベストタイミングとは？',
    excerpt: '外壁塗装はいつ行うべき？神戸三田エリアの気候に合わせた最適な時期と、塗装が必要なサインを解説します。',
    date: '2025-01-05',
    readTime: '6分',
    category: '外壁',
    tags: ['外壁', '塗装', 'タイミング'],
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: '鈴木 一郎',
      avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
    },
    summary: '外壁の劣化サインを見逃していませんか？適切な時期にメンテナンスを行うことで、大切なお住まいの寿命を延ばすことができます。自己診断のポイントも解説。',
    content: sampleContentHtml,
    checkpoints: [
      '築10年が経過したら専門家の診断を受ける',
      'チョーキング現象（白い粉）を確認する',
      'ヘアクラック（細いひび割れ）を見逃さない',
      'コーキングの劣化状況をチェック',
      '梅雨や台風シーズンを避けた工期設定'
    ]
  },
  {
    id: '4',
    title: 'リフォーム費用を抑える賢い方法',
    excerpt: '品質を落とさずにリフォーム費用を抑えるコツをプロが伝授。計画段階から知っておきたい節約術です。',
    date: '2024-12-28',
    readTime: '5分',
    category: 'コスト',
    tags: ['費用', '節約', '計画'],
    image: 'https://images.unsplash.com/photo-1523419400524-2122f6a4b3be?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: '佐藤 健太',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    },
    summary: '予算オーバーを防ぐための具体的なテクニックを公開。設備のグレード選びから、補助金の活用方法まで、賢くリフォームするためのノウハウです。',
    content: sampleContentHtml,
    checkpoints: [
      '優先順位を明確にしておく',
      '設備のグレードは必要な機能に絞る',
      '既存の配管位置を活かしたレイアウトにする',
      '自治体の補助金制度を確認する',
      '複数の業者から見積もりを取る'
    ]
  },
  {
    id: '5',
    title: 'リビングリフォームで家族の時間を豊かに',
    excerpt: '家族が集まるリビングを快適な空間に。間取り変更から照明計画まで、リビングリフォームのポイントを解説。',
    date: '2024-12-20',
    readTime: '5分',
    category: 'リビング',
    tags: ['リビング', '家族', '空間'],
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: '田中 美咲',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    summary: '家族構成の変化に合わせて、リビングの在り方も変化します。開放的なLDKへの変更や、ワークスペースの設置など、現代のライフスタイルに合ったプランをご提案。',
    content: sampleContentHtml,
    checkpoints: [
      '動線を意識した家具配置',
      '用途に合わせた照明計画（調光機能など）',
      '収納スペースの確保（壁面収納など）',
      '断熱リフォームで快適性アップ',
      'コンセント位置の最適化'
    ]
  },
  {
    id: '6',
    title: '和室を洋室にリフォームする際の注意点',
    excerpt: '使わなくなった和室を洋室に。畳からフローリングへの変更や、押入れをクローゼットにする際のポイントを解説。',
    date: '2024-12-15',
    readTime: '4分',
    category: '和室',
    tags: ['和室', '洋室', 'リフォーム'],
    image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: '鈴木 一郎',
      avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
    },
    summary: '和室から洋室へのリフォームは、床の高さ調整や防音対策など、見落としがちなポイントがあります。失敗しないための施工のポイントを詳しく解説します。',
    content: sampleContentHtml,
    checkpoints: [
      '床の段差解消（バリアフリー化）',
      'マンションの場合は防音規定を確認',
      '襖や障子の枠の処理方法を決める',
      '押入れの奥行きを活かしたクローゼット設計',
      '部屋全体の雰囲気統一（建具の色など）'
    ]
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '見積もりは本当に無料ですか？',
    answer: 'はい、お見積もりは完全無料です。現地調査も無料で行っておりますので、お気軽にご相談ください。契約に至らなかった場合でも費用は一切いただきません。'
  },
  {
    question: 'なぜ大手の半額以下でできるのですか？',
    answer: '私たちは仲介業者を通さない直接施工を行っているため、中間マージンが発生しません。また、地域密着で広告宣伝費を抑えているため、その分お客様に還元できています。'
  },
  {
    question: '工事期間はどのくらいですか？',
    answer: '工事内容により異なりますが、トイレ交換等の小規模なものは半日〜1日、キッチンや浴室は3日〜1週間、全面改装の場合は1ヶ月〜2ヶ月程度が目安です。詳細な工程表はご契約前に提示いたします。'
  },
  {
    question: '保証はありますか？',
    answer: 'はい、施工後最大5年間の保証をご用意しております。工事完了後も定期的な点検やアフターメンテナンスを行い、末永くサポートさせていただきます。'
  },
  {
    question: '対応エリアはどこですか？',
    answer: '主に神戸市北区、三田市、西宮市北部を中心に対応しております。車で1時間圏内を目安としていますが、その他の地域でも対応可能な場合がございますので、一度ご相談ください。'
  }
];

export const BLOG_CATEGORIES = [
  'すべて', 'キッチン', '浴室', '外壁', 'リビング', '和室', 'コスト'
];