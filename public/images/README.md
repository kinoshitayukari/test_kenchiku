# public/images ディレクトリの命名ガイド

ここにはビルド不要でそのまま配信したい画像を置きます。パスはコード側から `/images/<file>` で参照できます。

## ファイル名の決め方
- 半角英数とハイフンのみで構成し、全角やスペースを使わない。
- 画像の中身がわかるスラッグ＋サイズ・バリエーションをサフィックスに含める。
  - 例: `hero-kitchen-1920w.webp`, `hero-kitchen-960w.webp`
  - OGP 例: `ogp-sample-1200x630.png`
- 形式は `webp` を優先し、透過が必要なときだけ `png` を利用。
- 差し替えは新しいファイル名でアップロードし、不要になった旧ファイルを削除する。

### 用途別の推奨ファイル名（例）
- トップヒーロー: `hero-livingroom-1920w.webp`, `hero-livingroom-960w.webp`
- ブログサムネイル: `blog-modern-kitchen-1200x630.webp`, `blog-modern-kitchen-600x315.webp`
- 事例ギャラリー: `case-wooddeck-01-1600w.webp`, `case-wooddeck-01-800w.webp`
- ロゴ: `logo-primary-640w.png`（透過が必要な場合のみ png）
- アイコン/ピクト: `icon-phone-64w.webp`, `icon-mail-64w.webp`

## 配置例
```
public/
  images/
    hero-livingroom-1920w.webp
    hero-livingroom-960w.webp
    ogp-sample-1200x630.png
```
