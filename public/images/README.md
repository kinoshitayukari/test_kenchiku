# public/images ディレクトリの命名ガイド

ここにはビルド不要でそのまま配信したい画像を置きます。パスはコード側から `/images/<file>` で参照できます。

## ファイル名の決め方
- 半角英数とハイフンのみで構成し、全角やスペースを使わない。
- 画像の中身がわかるスラッグ＋サイズ・バリエーションをサフィックスに含める。
  - 例: `hero-kitchen-1920w.webp`, `hero-kitchen-960w.webp`
  - OGP 例: `ogp-sample-1200x630.png`
- 形式は `webp` を優先し、透過が必要なときだけ `png` を利用。
- 差し替えは新しいファイル名でアップロードし、不要になった旧ファイルを削除する。

## 配置例
```
public/
  images/
    hero-livingroom-1920w.webp
    hero-livingroom-960w.webp
    ogp-sample-1200x630.png
```
