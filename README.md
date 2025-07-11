# 温泉卵ブレスト

> 温泉卵キャラが 5 分間ノンストップで **強制連想法** を仕掛けるブレインストーミングツール。アイデアを一気に吐き出し、Markdown もしくは PNG で即エクスポートできます。

## 温泉卵の画像

public/onsen-tamago.png

---

## ✨ 主な機能

* **ワンクリックでスタート** ─ 5 分カウントダウンが開始
* **単語ペア** を表示、次へ or スキップ or 入力後送信で次の単語へ（ローカル `words.json` からランダム生成）
* **キーボード中心の入力体験** ─ Enter で送信、Skip ボタンでパス
* **タイムアップで自動遷移** → 結果画面に一覧表示
* **Markdown テーブルをワンクリックコピー**
* **html2canvas で PNG ダウンロード** & SNS シェア
* **完全フロントエンド** ─ DB 不要、静的ホスティング可

---

## 🛠️ 技術構成

| レイヤー        | 使用技術                             |
| ----------- | -------------------------------- |
| UI & ルーティング | **Next.js (React + TypeScript)** |
| 状態管理        | Zustand                          |
| スタイリング      | CSS Modules (Tailwind 併用可)       |
| 補助ライブラリ     | html2canvas / dayjs              |
| テスト         | Jest (ユニット) + Playwright (E2E)   |
| CI/CD       | GitHub Actions → Vercel          |

---

## 🚀 始め方

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-name/onsen-egg-brainstorm.git
cd onsen-egg-brainstorm

# 2. 依存関係をインストール
npm install  # Node.js v18 以上推奨

# 3. 開発サーバーを起動
npm run dev  # http://localhost:3000
```

### 利用可能な npm スクリプト

| コマンド    | 説明                             |
| ------- | ------------------------------ |
| `dev`   | 開発サーバー (HMR 対応)                |
| `build` | 本番ビルド (`.next/` 生成)            |
| `start` | ローカルで本番サーバー起動                  |
| `lint`  | ESLint + Prettier チェック         |
| `test`  | Jest (ユニット) + Playwright (E2E) |

---

## 📁 ディレクトリ構成

```
.
├── components/    # UI コンポーネント
├── hooks/         # useCountdown, useWordPair など
├── pages/
│   ├── index.tsx   # スタート画面（温泉卵＋Start ボタン）
│   ├── session.tsx # ブレスト進行画面
│   └── result.tsx  # Markdown / PNG 出力画面
├── data/
│   └── words.json  # 日本語名詞 300+ 語
└── public/
    └── mascot.png  # 温泉卵の画像アセット
```
