# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「温泉卵ブレスト」は、5分間のブレインストーミングツール。温泉卵キャラクターが強制連想法で単語ペアを表示し、アイデア出しをサポートする Next.js アプリケーション。

## 開発環境セットアップと主要コマンド

```bash
# 開発サーバー起動（ホットリロード対応）
npm run dev

# 本番ビルド生成
npm run build

# 本番サーバー起動
npm run start

# ESLintによるコードチェック
npm run lint
```

## プロジェクト構成

### 技術スタック
- **フレームワーク**: Next.js 15.3.5 (React + TypeScript)
- **スタイリング**: Tailwind CSS v4 + CSS Modules
- **状態管理**: Zustand（README記載、未実装）
- **Node.js**: v18以上推奨

### ディレクトリ構造の重要ポイント

```
src/app/          # App Router構成
├── layout.tsx    # ルートレイアウト（Geistフォント設定）
├── page.tsx      # ホームページ（/）
└── globals.css   # グローバルスタイル

components/       # UIコンポーネント（未実装）
hooks/           # カスタムフック（useCountdown等、未実装）
data/            # words.json（日本語名詞300+語、未実装）
```

### 未実装の主要機能（README記載）

1. **ページルーティング**:
   - `/` - スタート画面（温泉卵＋Startボタン）
   - `/session` - ブレスト進行画面
   - `/result` - 結果表示画面（Markdown/PNG出力）

2. **必要な実装**:
   - Zustand による状態管理
   - html2canvas でのPNGエクスポート
   - dayjs でのタイマー管理
   - words.json からの単語ペア生成
   - Jest + Playwright によるテスト

### TypeScript設定
- strict モード有効
- パスエイリアス: `@/*` → `./src/*`
- ES2017ターゲット

### 開発時の注意点
- 現在は初期状態（create-next-app直後）
- README記載の機能は未実装
- フロントエンド完結型（DB不要）