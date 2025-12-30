# スプレッドシート勉強用サイト

Excelやスプレッドシートの実務力を向上させるための学習アプリケーションです。

## 技術スタック

### フロントエンドフレームワーク
- **Next.js 16.1.0** - Reactフレームワーク（App Router使用）
- **React 19.2.3** - UIライブラリ
- **TypeScript 5** - 型安全性

### スタイリング
- **Tailwind CSS 4** - ユーティリティファーストのCSSフレームワーク
- **shadcn/ui 0.9.5** - 再利用可能なUIコンポーネント
- **lucide-react** - アイコンライブラリ
- **class-variance-authority** - コンポーネントバリアント管理
- **clsx** - 条件付きクラス名の結合
- **tailwind-merge** - Tailwindクラスのマージ

### 認証・データベース
- **Supabase** - バックエンドサービス
  - `@supabase/supabase-js ^2.89.0` - Supabase JavaScriptクライアント
  - `@supabase/auth-helpers-nextjs ^0.15.0` - Next.js用認証ヘルパー

### コンテンツ管理
- **gray-matter ^4.0.3** - Markdown frontmatter解析
- **react-markdown ^10.1.0** - Markdownレンダリング
- **remark-gfm ^4.0.1** - GitHub Flavored Markdown対応

### UIコンポーネント
- **@radix-ui/react-slot ^1.2.4** - Radix UIのスロットコンポーネント

### 開発ツール
- **ESLint** - コードリンティング
- **TypeScript** - 型チェック
- **tw-animate-css ^1.4.0** - Tailwindアニメーション拡張