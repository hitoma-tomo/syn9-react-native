// Supabaseデータベースの型定義
// Syn9 Flutter Firestoreモデルから変換

export interface Database {
  public: {
    Tables: {
      // ユーザーテーブル
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          photo_url: string | null;
          uid: string | null;
          phone_number: string | null;
          updated_at: string | null;
          created_time: string | null;
          background_image: string | null;
          user_name: string | null;
          is_purchased: boolean | null;
          is_withdrawal: boolean | null;
          country_code: string | null;
          is_allow_find_id: boolean | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          photo_url?: string | null;
          uid?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          created_time?: string | null;
          background_image?: string | null;
          user_name?: string | null;
          is_purchased?: boolean | null;
          is_withdrawal?: boolean | null;
          country_code?: string | null;
          is_allow_find_id?: boolean | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          photo_url?: string | null;
          uid?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          created_time?: string | null;
          background_image?: string | null;
          user_name?: string | null;
          is_purchased?: boolean | null;
          is_withdrawal?: boolean | null;
          country_code?: string | null;
          is_allow_find_id?: boolean | null;
        };
      };

      // チャットルームテーブル
      chat_rooms: {
        Row: {
          id: string;
          group_image: string | null;
          group_name: string | null;
          is_group: boolean | null;
          user_list: string[] | null;
          updated_at: string | null;
          user_a: string | null;
          user_b: string | null;
          last_message: string | null;
          last_message_sent_user: string | null;
          last_message_time: string | null;
          schedule_ref: string | null;
          memo_ref: string | null;
          timestamp: string | null;
          mute_user_list: string[] | null;
          is_clear_cache: boolean | null;
        };
        Insert: {
          id?: string;
          group_image?: string | null;
          group_name?: string | null;
          is_group?: boolean | null;
          user_list?: string[] | null;
          updated_at?: string | null;
          user_a?: string | null;
          user_b?: string | null;
          last_message?: string | null;
          last_message_sent_user?: string | null;
          last_message_time?: string | null;
          schedule_ref?: string | null;
          memo_ref?: string | null;
          timestamp?: string | null;
          mute_user_list?: string[] | null;
          is_clear_cache?: boolean | null;
        };
        Update: {
          id?: string;
          group_image?: string | null;
          group_name?: string | null;
          is_group?: boolean | null;
          user_list?: string[] | null;
          updated_at?: string | null;
          user_a?: string | null;
          user_b?: string | null;
          last_message?: string | null;
          last_message_sent_user?: string | null;
          last_message_time?: string | null;
          schedule_ref?: string | null;
          memo_ref?: string | null;
          timestamp?: string | null;
          mute_user_list?: string[] | null;
          is_clear_cache?: boolean | null;
        };
      };

      // メッセージテーブル
      messages: {
        Row: {
          id: string;
          chat_room_id: string;
          contents: string | null;
          photos: string | null;
          updated_at: string | null;
          send_user: string | null;
          is_first_message_on_day: boolean | null;
          timestamp: string | null;
          is_send: boolean | null;
          is_delete: boolean | null;
          reaction_json: string | null;
        };
        Insert: {
          id?: string;
          chat_room_id: string;
          contents?: string | null;
          photos?: string | null;
          updated_at?: string | null;
          send_user?: string | null;
          is_first_message_on_day?: boolean | null;
          timestamp?: string | null;
          is_send?: boolean | null;
          is_delete?: boolean | null;
          reaction_json?: string | null;
        };
        Update: {
          id?: string;
          chat_room_id?: string;
          contents?: string | null;
          photos?: string | null;
          updated_at?: string | null;
          send_user?: string | null;
          is_first_message_on_day?: boolean | null;
          timestamp?: string | null;
          is_send?: boolean | null;
          is_delete?: boolean | null;
          reaction_json?: string | null;
        };
      };

      // 友達関係テーブル
      friends: {
        Row: {
          id: string;
          user_id: string;
          follow: string | null;
          blocked: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          is_blocked: boolean | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          follow?: string | null;
          blocked?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_blocked?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          follow?: string | null;
          blocked?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_blocked?: boolean | null;
        };
      };

      // メモテーブル
      memos: {
        Row: {
          id: string;
          content: string | null;
          parent_folder: string | null;
          user_list: string[] | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
          content_text_only: string | null;
        };
        Insert: {
          id?: string;
          content?: string | null;
          parent_folder?: string | null;
          user_list?: string[] | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          content_text_only?: string | null;
        };
        Update: {
          id?: string;
          content?: string | null;
          parent_folder?: string | null;
          user_list?: string[] | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          content_text_only?: string | null;
        };
      };

      // カレンダーテーブル
      calendars: {
        Row: {
          id: string;
          start_date: string | null;
          end_date: string | null;
          title: string | null;
          memo: string | null;
          place: string | null;
          url: string | null;
          is_created: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          created_by: string | null;
          user_list: string[] | null;
        };
        Insert: {
          id?: string;
          start_date?: string | null;
          end_date?: string | null;
          title?: string | null;
          memo?: string | null;
          place?: string | null;
          url?: string | null;
          is_created?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
          user_list?: string[] | null;
        };
        Update: {
          id?: string;
          start_date?: string | null;
          end_date?: string | null;
          title?: string | null;
          memo?: string | null;
          place?: string | null;
          url?: string | null;
          is_created?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
          user_list?: string[] | null;
        };
      };

      // フォルダテーブル
      folders: {
        Row: {
          id: string;
          name: string;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };

      // 未読ユーザーテーブル
      non_read_users: {
        Row: {
          id: string;
          chat_room_id: string;
          user_id: string;
          last_read_message_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          chat_room_id: string;
          user_id: string;
          last_read_message_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          chat_room_id?: string;
          user_id?: string;
          last_read_message_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };

      // 一時的な友達関係テーブル
      tmp_friends: {
        Row: {
          id: string;
          requester_id: string;
          requested_id: string;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          requester_id: string;
          requested_id: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          requester_id?: string;
          requested_id?: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
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

// Syn9アプリの具体的な型
export type User = Tables<'users'>;
export type ChatRoom = Tables<'chat_rooms'>;
export type Message = Tables<'messages'>;
export type Friend = Tables<'friends'>;
export type Memo = Tables<'memos'>;
export type Calendar = Tables<'calendars'>;
export type Folder = Tables<'folders'>;
export type NonReadUser = Tables<'non_read_users'>;
export type TmpFriend = Tables<'tmp_friends'>;

// Insert用の型
export type InsertUser = InsertTables<'users'>;
export type InsertChatRoom = InsertTables<'chat_rooms'>;
export type InsertMessage = InsertTables<'messages'>;
export type InsertFriend = InsertTables<'friends'>;
export type InsertMemo = InsertTables<'memos'>;
export type InsertCalendar = InsertTables<'calendars'>;
export type InsertFolder = InsertTables<'folders'>;

// Update用の型
export type UpdateUser = UpdateTables<'users'>;
export type UpdateChatRoom = UpdateTables<'chat_rooms'>;
export type UpdateMessage = UpdateTables<'messages'>;
export type UpdateFriend = UpdateTables<'friends'>;
export type UpdateMemo = UpdateTables<'memos'>;
export type UpdateCalendar = UpdateTables<'calendars'>;
