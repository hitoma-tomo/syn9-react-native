// Supabaseデータベースの型定義
// 実際のテーブル構造に合わせて更新してください

export interface Database {
  public: {
    Tables: {
      // 例: ユーザープロフィールテーブル
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      
      // 例: 投稿テーブル
      posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          author_id: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          author_id: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          author_id?: string;
          published?: boolean;
        };
      };
    };
    Views: {
      // ビューがある場合はここに定義
    };
    Functions: {
      // カスタム関数がある場合はここに定義
    };
    Enums: {
      // Enumがある場合はここに定義
    };
  };
}

// 便利な型エイリアス
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

// 具体的な型
export type Profile = Tables<'profiles'>;
export type Post = Tables<'posts'>;
export type InsertProfile = InsertTables<'profiles'>;
export type InsertPost = InsertTables<'posts'>;
export type UpdateProfile = UpdateTables<'profiles'>;
export type UpdatePost = UpdateTables<'posts'>;
