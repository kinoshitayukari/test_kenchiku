const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase の URL と Anon Key を環境変数に設定してください。');
  process.exit(1);
}

const getHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=representation'
});

const posts = [
  {
    id: 'reform-planning-basics',
    title: '失敗しないリフォーム計画の基本ステップ',
    excerpt: '予算づくりからスケジュール管理まで、リフォーム成功のための計画術を解説します。',
    date: '2025-02-01',
    read_time: '6分',
    category: '計画・準備',
    tags: ['計画', '予算', 'スケジュール'],
    author_name: '智明建築工房',
    summary: '初めての方でも安心して進められる計画の作り方。',
    content:
      'リフォームは「いつまでに」「いくらで」「どこまで」を明確にすることが成功の鍵です。この記事では、1) 生活動線の見直し、2) 必要な工事と優先順位の整理、3) 余裕をもたせた予算組み、4) 施工前の近隣挨拶まで、準備段階で押さえるポイントを詳しく紹介します。',
    checkpoints: ['要望の優先順位を書き出す', '予算は余裕をもって10〜15%上乗せ', '仮住まい・荷物置き場を事前に確保']
  },
  {
    id: 'durability-inspection-points',
    title: '耐久性アップのための住宅チェックポイント',
    excerpt: '雨漏り・結露・構造劣化を防ぐために見ておきたい家の健康診断リスト。',
    date: '2025-02-05',
    read_time: '7分',
    category: 'メンテナンス',
    tags: ['点検', '耐久性', '結露対策'],
    author_name: '智明建築工房',
    summary: '工事前に確認すれば追加費用を抑えやすくなります。',
    content:
      '外壁のひび割れ、バルコニー防水の膨れ、サッシ周りの黒ずみは劣化のサインです。点検時は「水の侵入経路」と「湿気の抜け道」に注目してください。床下の換気、屋根の下葺き材の状態、断熱材のずれなど、見逃しがちな箇所も写真で解説し、業者に相談するときのチェックリストを用意しました。',
    checkpoints: ['雨仕舞いの確認を写真で残す', 'バルコニーはドレン掃除を徹底', '床下の湿度と換気経路を確認']
  },
  {
    id: 'thermal-insulation-upgrade',
    title: '断熱リフォームで快適さと光熱費を両立',
    excerpt: '窓交換・内窓設置・床断熱の違いと費用対効果をわかりやすく比較。',
    date: '2025-02-08',
    read_time: '8分',
    category: '断熱・省エネ',
    tags: ['断熱', '省エネ', '内窓'],
    author_name: '智明建築工房',
    summary: '体感温度を上げるには「窓・隙間・換気」の3点が重要です。',
    content:
      '熱の約6割は窓から出入りします。内窓を追加するだけでも冬の冷気や夏の暑さを大幅に抑えられ、結露も軽減できます。床下断熱や壁断熱を併用する場合の工事手順、補助金の活用方法、換気計画の見直しポイントを具体的に紹介します。',
    checkpoints: ['窓種別ごとの断熱性能を比較', '補助金の併用可否を事前に確認', '換気量を下げ過ぎないよう注意']
  },
  {
    id: 'water-area-renovation',
    title: 'キッチン・浴室・洗面のリフォーム動線',
    excerpt: '水まわり3点セットをまとめて工事するメリットと、使いやすさを左右する配置のコツ。',
    date: '2025-02-12',
    read_time: '6分',
    category: '水まわり',
    tags: ['キッチン', '浴室', '洗面'],
    author_name: '智明建築工房',
    summary: '移動距離を短縮し、掃除しやすい素材を選ぶのがポイント。',
    content:
      'キッチンと洗面脱衣室の行き来が多い場合、家事動線を直線にまとめると効率が上がります。浴室は断熱性能の高いユニットバスにし、洗面は収納を壁面に集約することで床掃除が楽になります。配管の位置を大きく動かす場合は床下スペースや給水・排水の勾配を事前に確認しましょう。',
    checkpoints: ['家事動線を紙に書いてシミュレーション', '水はねが多い場所は掃除しやすい素材を選択', '配管移設の可否を現場で確認']
  },
  {
    id: 'earthquake-retrofit',
    title: '耐震リフォームで守る家族の安全',
    excerpt: '壁量計算と金物補強、基礎補修の流れをやさしく解説します。',
    date: '2025-02-15',
    read_time: '7分',
    category: '耐震',
    tags: ['耐震', '補強', '基礎'],
    author_name: '智明建築工房',
    summary: '図面が無い場合でも現地調査で補強計画を立てられます。',
    content:
      '耐震補強は「壁のバランス」「接合部の強化」「基礎の健全性」の3点をセットで考えます。筋交い追加や構造用合板で壁量を確保し、柱脚・柱頭金物を適切に配置することで耐力壁が十分に働きます。基礎にクラックがある場合はエポキシ樹脂注入や無収縮モルタルで補修し、アンカーボルトの増設を検討しましょう。',
    checkpoints: ['耐力壁の配置バランスを確認', '既存金物の種類と締付けをチェック', '基礎のひび割れ幅を測定して補修方法を選定']
  },
  {
    id: 'renovation-budget-control',
    title: 'リフォーム費用を抑える見積りの読み解き方',
    excerpt: '相見積もりで比較すべきポイントと、削ってはいけない工事項目を解説。',
    date: '2025-02-18',
    read_time: '5分',
    category: '費用',
    tags: ['見積り', 'コストダウン', '工事範囲'],
    author_name: '智明建築工房',
    summary: '工事の質を落とさずにコストを最適化するコツがあります。',
    content:
      '見積書では「仮設・養生」「下地調整」「処分費」を軽視しないことが重要です。単価だけで比較せず、工事範囲と施工手順を確認しましょう。グレードを下げても支障が少ない部分（壁紙の一部や造作棚の素材など）と、削ると後悔する部分（防水・断熱・下地補修）を具体例付きで紹介します。',
    checkpoints: ['施工手順と範囲が明記されているか確認', '仮設・養生費の有無をチェック', '値引きより仕様変更の方が効果的な場合も検討']
  }
];

async function seedBlogs() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(posts)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Seed failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const inserted = await response.json();
  console.log(`ブログ記事を ${inserted.length} 件アップサートしました。`);
}

seedBlogs().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
