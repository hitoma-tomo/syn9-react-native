// 管理者用Supabaseクライアント（サーバーサイドでのみ使用）
import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

// ⚠️ 注意: Secret Keyは絶対にクライアントサイドで使用しない
// サーバーサイド（API Routes、Serverless Functions等）でのみ使用

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Secret Key

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key must be provided');
}

// 管理者権限のSupabaseクライアント
export const adminSupabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// 管理者専用の操作例

// 1. 全ユーザーのデータを取得（RLSをバイパス）
export const getAllUsers = async () => {
  const { data, error } = await adminSupabase.auth.admin.listUsers();
  return { data, error };
};

// 2. ユーザーを削除
export const deleteUser = async (userId: string) => {
  const { data, error } = await adminSupabase.auth.admin.deleteUser(userId);
  return { data, error };
};

// 3. ユーザーのメタデータを更新
export const updateUserMetadata = async (userId: string, metadata: any) => {
  const { data, error } = await adminSupabase.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });
  return { data, error };
};

// 4. 全投稿を取得（RLSをバイパス）
export const getAllPosts = async () => {
  const { data, error } = await adminSupabase
    .from('posts')
    .select('*');
  return { data, error };
};

// 5. 任意のユーザーの投稿を削除（管理者権限）
export const deletePostAsAdmin = async (postId: string) => {
  const { error } = await adminSupabase
    .from('posts')
    .delete()
    .eq('id', postId);
  return { error };
};

// 6. システム統計の取得
export const getSystemStats = async () => {
  const [usersResult, postsResult] = await Promise.all([
    adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
    adminSupabase.from('posts').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: usersResult.count || 0,
    totalPosts: postsResult.count || 0,
  };
};
