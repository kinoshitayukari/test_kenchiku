import { BlogPost } from '../types';

interface GeminiDraftResponse {
  title?: string;
  excerpt?: string;
  summary?: string;
  content?: string;
  tags?: string[] | string;
  checkpoints?: string[] | string;
  readTime?: string;
  image?: string;
}

const buildPrompt = (keyword: string) => `以下のキーワードを中心に、住宅リフォーム会社のブログ記事の下書きを日本語で作成してください。\n\nキーワード: ${keyword}\n\n以下のJSON形式のみで出力してください。本文はHTMLの段落や小見出しを使い、装飾はシンプルにしてください。\n{\n  "title": "タイトル",\n  "excerpt": "一覧用の短い抜粋",\n  "summary": "記事冒頭に掲載する要約",\n  "content": "<p>本文をHTMLで</p>",\n  "tags": ["タグ1", "タグ2"],\n  "checkpoints": ["読者へのポイント1", "ポイント2"],\n  "readTime": "5分"\n}`;

const normalizeArray = (value: string[] | string | undefined): string[] => {
  if (Array.isArray(value)) return value.filter((v) => !!v).map((v) => v.toString());
  if (typeof value === 'string') {
    return value
      .split(/,|\n/)
      .map((v) => v.trim())
      .filter((v) => v !== '');
  }
  return [];
};

export const geminiService = {
  generateBlogDraft: async (
    apiKey: string,
    keyword: string
  ): Promise<Partial<BlogPost> & { checkpoints?: string[] }> => {
    if (!apiKey?.trim()) {
      throw new Error('Gemini APIキーを入力してください。');
    }
    if (!keyword?.trim()) {
      throw new Error('生成用のキーワードを入力してください。');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: buildPrompt(keyword) }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('AI生成リクエストに失敗しました。APIキーと利用状況をご確認ください。');
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    if (!text) {
      throw new Error('生成結果が空でした。キーワードを変えてお試しください。');
    }

    let parsed: GeminiDraftResponse;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse Gemini response', err, text);
      throw new Error('生成結果の解析に失敗しました。出力形式を確認してください。');
    }

    const tags = normalizeArray(parsed.tags);
    const checkpoints = normalizeArray(parsed.checkpoints);

    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      summary: parsed.summary,
      content: parsed.content,
      tags,
      checkpoints,
      readTime: parsed.readTime ?? '5分',
      image: parsed.image
    };
  }
};
