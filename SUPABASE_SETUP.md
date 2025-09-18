# Supabase設定ガイド

このプロジェクトではSupabaseをバックエンドとして使用します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAnon Keyを取得

## 2. 環境変数の設定

プロジェクトルートに`.env`ファイルを作成し、以下の内容を追加：

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

例:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. データベーステーブルの作成（例）

Supabaseダッシュボードで以下のSQLを実行してサンプルテーブルを作成：

### プロフィールテーブル
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  PRIMARY KEY (id)
);

-- RLS (Row Level Security) を有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のプロフィールのみアクセス可能
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 投稿テーブル
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false
);

-- RLS を有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 公開された投稿は誰でも閲覧可能
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (published = true);

-- ユーザーは自分の投稿のみ作成・編集可能
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);
```

## 4. 使用方法

### 認証
```typescript
import { useAuth } from '@/hooks/use-auth';
import { signIn, signUp, signOut } from '@/lib/auth';

// コンポーネント内で
const { user, session, loading } = useAuth();

// サインイン
await signIn('user@example.com', 'password');

// サインアップ
await signUp('user@example.com', 'password');

// サインアウト
await signOut();
```

### データベース操作
```typescript
import { fetchData, insertData, updateData, deleteData } from '@/lib/database';
import { Post } from '@/types/supabase';

// データ取得
const { data, error } = await fetchData<Post>('posts');

// データ挿入
const newPost = {
  title: 'タイトル',
  content: '内容',
  author_id: user.id,
  published: true,
};
await insertData('posts', newPost);

// データ更新
await updateData('posts', postId, { title: '新しいタイトル' });

// データ削除
await deleteData('posts', postId);
```

## 5. 型定義の更新

実際のデータベーススキーマに合わせて `types/supabase.ts` を更新してください。
Supabaseの型生成ツールを使用することもできます：

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

## 6. セキュリティ設定

- Row Level Security (RLS) を適切に設定
- 環境変数ファイル (`.env`) を `.gitignore` に追加
- プロダクション環境では適切な認証ポリシーを設定

## トラブルシューティング

### よくある問題

1. **認証エラー**: 環境変数が正しく設定されているか確認
2. **データベースエラー**: RLSポリシーが適切に設定されているか確認
3. **型エラー**: `types/supabase.ts` がデータベーススキーマと一致しているか確認

### ログの確認

開発中はSupabaseダッシュボードのログタブで詳細なエラー情報を確認できます。
