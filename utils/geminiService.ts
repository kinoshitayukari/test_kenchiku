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

// The v1beta generateContent endpoint only supports the base model ID without the
// version suffix. See error: models/gemini-2.5-flash-001 is not found for API
// version v1beta. Use the base name so generateContent works reliably.
const GEMINI_MODEL = 'gemini-2.5-flash';

const buildPrompt = (keyword: string) => `以下のキーワードを中心に、住宅リフォーム会社のブログ記事の下書きを日本語で作成してください。\n\nキーワード: ${keyword}\n\n以下のJSON形式のみで出力してください。本文はHTMLで、読みやすさのために必ず\n- h2の大見出しを3〜5本\n- h3の小見出しを必要に応じて挿入\n- 各見出しの下に<p>で段落\n- 箇条書きがあれば<ul><li>を使用\nといったシンプルな構造を付けてください。画像はURL文字列のみで、バイト列やBase64は含めないでください。余計な文章や説明は不要です。\n{\n  "title": "タイトル",\n  "excerpt": "一覧用の短い抜粋",\n  "summary": "記事冒頭に掲載する要約",\n  "content": "<h2>大見出し</h2><p>本文をHTMLで</p>",\n  "tags": ["タグ1", "タグ2"],\n  "checkpoints": ["読者へのポイント1", "ポイント2"],\n  "readTime": "5分"\n}`;

const buildRegenerationPrompt = (instruction: string, currentPost: Partial<BlogPost>) => {
  const serialized = {
    title: currentPost.title,
    excerpt: currentPost.excerpt,
    summary: currentPost.summary,
    content: currentPost.content,
    tags: currentPost.tags,
    checkpoints: currentPost.checkpoints,
    readTime: currentPost.readTime,
    category: currentPost.category
  };

  return `以下の既存記事を、追加の要望に沿って日本語でブラッシュアップしてください。見出し構成とHTML形式は維持しつつ、内容をより良くしてください。\n\n[要望]\n${instruction}\n\n[既存記事]\n${JSON.stringify(serialized, null, 2)}\n\n以下のJSON形式のみで返してください。フィールド名は変更せず、値が不要なら空文字や空配列で構いません。画像はURL文字列のみを許可し、Base64やバイト列は含めないでください。JSON以外の文章やコードブロックを付けないでください。\n{\n  "title": "タイトル",\n  "excerpt": "一覧用の短い抜粋",\n  "summary": "記事冒頭に掲載する要約",\n  "content": "<h2>大見出し</h2><p>本文をHTMLで</p>",\n  "tags": ["タグ1", "タグ2"],\n  "checkpoints": ["読者へのポイント1", "ポイント2"],\n  "readTime": "5分",\n  "image": "任意の画像URL"\n}`;
};

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

const extractJsonText = (text: string) => {
  const trimmed = text.trim();

  if (trimmed.startsWith('```')) {
    const noFence = trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '');
    return noFence.trim();
  }

  // Some responses prepend explanations. Try to capture the first JSON object.
  const jsonLike = trimmed.match(/\{[\s\S]*\}/);
  if (jsonLike) {
    return jsonLike[0].trim();
  }

  return trimmed;
};

const parseJsonResponse = (text: string, errorMessage: string): GeminiDraftResponse => {
  try {
    return JSON.parse(extractJsonText(text));
  } catch (err) {
    console.error('Failed to parse Gemini response', err, text);
    throw new Error(errorMessage);
  }
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
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
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
      let message = 'AI生成リクエストに失敗しました。APIキーと利用状況をご確認ください。';
      try {
        const errorBody = await response.json();
        const apiMessage = errorBody?.error?.message as string | undefined;
        if (apiMessage) {
          message += ` (${apiMessage})`;
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini error response', parseError);
      }
      throw new Error(message);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    if (!text) {
      throw new Error('生成結果が空でした。キーワードを変えてお試しください。');
    }

    const parsed = parseJsonResponse(text, '生成結果の解析に失敗しました。出力形式を確認してください。');

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
  },

  regenerateBlogContent: async (
    apiKey: string,
    instruction: string,
    currentPost: Partial<BlogPost>
  ): Promise<Partial<BlogPost> & { checkpoints?: string[] }> => {
    if (!apiKey?.trim()) {
      throw new Error('Gemini APIキーを入力してください。');
    }

    if (!instruction?.trim()) {
      throw new Error('再生成用のプロンプトを入力してください。');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: buildRegenerationPrompt(instruction, currentPost) }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      let message = 'AI再生成リクエストに失敗しました。APIキーと要望を確認してください。';
      try {
        const errorBody = await response.json();
        const apiMessage = errorBody?.error?.message as string | undefined;
        if (apiMessage) {
          message += ` (${apiMessage})`;
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini regeneration error response', parseError);
      }
      throw new Error(message);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    if (!text) {
      throw new Error('再生成結果が空でした。プロンプトを調整して再度お試しください。');
    }

    const parsed = parseJsonResponse(text, '再生成結果の解析に失敗しました。出力形式を確認してください。');

    const tags = normalizeArray(parsed.tags);
    const checkpoints = normalizeArray(parsed.checkpoints);

    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      summary: parsed.summary,
      content: parsed.content,
      tags,
      checkpoints,
      readTime: parsed.readTime ?? currentPost.readTime ?? '5分',
      image: parsed.image ?? currentPost.image
    };
  }
};
