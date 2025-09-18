-- Syn9アプリのSupabaseテーブル定義
-- FlutterのFirestoreモデルから変換

-- 1. ユーザーテーブル
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  uid TEXT UNIQUE, -- Firebase UIDとの互換性のため
  phone_number TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  background_image TEXT,
  user_name TEXT,
  is_purchased BOOLEAN DEFAULT false,
  is_withdrawal BOOLEAN DEFAULT false,
  country_code TEXT,
  is_allow_find_id BOOLEAN DEFAULT false
);

-- 2. チャットルームテーブル
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_image TEXT,
  group_name TEXT,
  is_group BOOLEAN DEFAULT false,
  user_list UUID[] DEFAULT '{}', -- ユーザーIDの配列
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_a UUID REFERENCES users(id) ON DELETE CASCADE, -- 
  user_b UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_sent_user UUID REFERENCES users(id) ON DELETE SET NULL,
  last_message_time TIMESTAMP WITH TIME ZONE,
  schedule_ref UUID, -- カレンダーとの関連
  memo_ref UUID, -- メモとの関連
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mute_user_list UUID[] DEFAULT '{}',
  is_clear_cache BOOLEAN DEFAULT false
);

-- 3. メッセージテーブル（チャットルームのサブコレクション相当）
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  contents TEXT,
  photos TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  send_user UUID REFERENCES users(id) ON DELETE CASCADE,
  is_first_message_on_day BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_send BOOLEAN DEFAULT false,
  is_delete BOOLEAN DEFAULT false,
  reaction_json TEXT -- JSON形式でリアクション情報を保存
);

-- 4. 友達関係テーブル（ユーザーのサブコレクション相当）
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  follow UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT false
);

-- 5. メモテーブル
CREATE TABLE memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT,
  parent_folder UUID, -- フォルダとの関連
  user_list UUID[] DEFAULT '{}',
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content_text_only TEXT
);

-- 6. カレンダーテーブル
CREATE TABLE calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  title TEXT,
  memo TEXT,
  place TEXT,
  url TEXT,
  is_created BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  user_list UUID[] DEFAULT '{}'
);

-- 7. フォルダテーブル（推測）
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 未読ユーザーテーブル（推測）
CREATE TABLE non_read_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 一時的な友達関係テーブル（推測）
CREATE TABLE tmp_friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requested_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) の設定

-- ユーザーテーブル
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- チャットルームテーブル
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their chat rooms" ON chat_rooms 
  FOR SELECT USING (
    auth.uid() = user_a OR 
    auth.uid() = user_b OR 
    auth.uid() = ANY(user_list)
  );

-- メッセージテーブル
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their chat rooms" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = messages.chat_room_id 
      AND (
        auth.uid() = chat_rooms.user_a OR 
        auth.uid() = chat_rooms.user_b OR 
        auth.uid() = ANY(chat_rooms.user_list)
      )
    )
  );

-- 友達関係テーブル
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their friends" ON friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = follow);

-- メモテーブル
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their memos" ON memos
  FOR SELECT USING (auth.uid() = created_by OR auth.uid() = ANY(user_list));

-- カレンダーテーブル
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their calendars" ON calendars
  FOR SELECT USING (auth.uid() = created_by OR auth.uid() = ANY(user_list));

-- フォルダテーブル
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their folders" ON folders
  FOR SELECT USING (auth.uid() = created_by);

-- 未読ユーザーテーブル
ALTER TABLE non_read_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their read status" ON non_read_users
  FOR SELECT USING (auth.uid() = user_id);

-- 一時的な友達関係テーブル
ALTER TABLE tmp_friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their friend requests" ON tmp_friends
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- インデックスの作成（パフォーマンス向上のため）
CREATE INDEX idx_chat_rooms_users ON chat_rooms(user_a, user_b);
CREATE INDEX idx_messages_chat_room ON messages(chat_room_id, timestamp DESC);
CREATE INDEX idx_friends_user ON friends(user_id, follow);
CREATE INDEX idx_memos_created_by ON memos(created_by);
CREATE INDEX idx_calendars_created_by ON calendars(created_by);
CREATE INDEX idx_calendars_dates ON calendars(start_date, end_date);

-- 外部キー制約の追加
ALTER TABLE chat_rooms ADD CONSTRAINT fk_schedule_ref FOREIGN KEY (schedule_ref) REFERENCES calendars(id);
ALTER TABLE chat_rooms ADD CONSTRAINT fk_memo_ref FOREIGN KEY (memo_ref) REFERENCES memos(id);
ALTER TABLE memos ADD CONSTRAINT fk_parent_folder FOREIGN KEY (parent_folder) REFERENCES folders(id);
