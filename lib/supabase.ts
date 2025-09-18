import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Supabaseの設定
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided');
}

// Supabaseクライアントを作成（型安全）
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // React Nativeでの認証設定
    storage: {
      getItem: async (key: string) => {
        // AsyncStorageを使用する場合は、ここでAsyncStorageから値を取得
        // 今回は簡単のためデフォルト実装を使用
        return null;
      },
      setItem: async (key: string, value: string) => {
        // AsyncStorageを使用する場合は、ここでAsyncStorageに値を保存
        // 今回は簡単のためデフォルト実装を使用
        return;
      },
      removeItem: async (key: string) => {
        // AsyncStorageを使用する場合は、ここでAsyncStorageから値を削除
        // 今回は簡単のためデフォルト実装を使用
        return;
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
