# Sea Trip Planner

カップル2人でディズニーシー旅行を共同で計画・管理するためのWebアプリ。

## 技術スタック

- **フロントエンド**: Next.js (Pages Router) + TypeScript
- **UI**: MUI (Material UI) + Emotion
- **バックエンド/DB**: Firebase (Firestore + Authentication)
- **デプロイ**: Firebase Hosting

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、Firebase の設定値を入力：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Firebase コンソール > プロジェクト設定 > マイアプリ から取得できます。

### 3. Firebase プロジェクトの準備

Firebase コンソールで以下を有効化してください：

- **Authentication** > メール/パスワード認証を有効化
- **Firestore Database** > データベースを作成

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## アプリの使い方

### 初回利用（1人目）

1. `/login` でメールアドレスとパスワードでサインアップ
2. トリップ一覧画面で「新しいトリップを作成」をタップ
3. 旅行名と旅行日を入力して作成
4. タイムライン・チェックリスト・ホテル比較・費用サマリーの初期データが自動で挿入される

### 2人目の招待

1. トリップ詳細画面のヘッダーにある共有リンクをコピー
2. 2人目に招待リンク（`/invite/[code]`）を送る
3. 2人目がリンクを開いてサインアップ/ログインすると、トリップに参加できる

### 主な機能

| タブ | 機能 |
|------|------|
| **タイムライン** | 当日のスケジュール管理。開始/終了時刻、タイトル、カテゴリ等をインライン編集。完了チェック付き |
| **予約チェック** | チェックリスト（予約管理）、ホテル比較テーブル、費用サマリーをまとめて表示 |

## デプロイ

### Firebase CLI のインストール

```bash
npm install -g firebase-tools
```

### ログインとデプロイ

```bash
# Firebase にログイン
firebase login

# Hosting + Firestore ルールをまとめてデプロイ
npm run deploy

# 個別デプロイも可能
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

## npm スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 静的エクスポート（`out/` に出力） |
| `npm run lint` | ESLint 実行 |
| `npm run deploy` | ビルド + Firebase デプロイ |

## プロジェクト構成

```
pages/
  _app.tsx           # ThemeProvider + AuthProvider
  index.tsx          # トリップ一覧
  login.tsx          # 認証画面
  trip/[id].tsx      # トリップ詳細（メイン画面）
  invite/[code].tsx  # 招待リンク受理
src/
  components/        # UI コンポーネント
  hooks/             # カスタムフック (useTimeline, useChecklist 等)
  contexts/          # AuthContext
  lib/               # Firebase 初期化、テーマ、型定義、定数
  firestore.rules    # Firestore セキュリティルール
```
