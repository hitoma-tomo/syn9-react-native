-- RLSが無効になっているテーブルを修正

-- フォルダテーブル
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their folders" ON folders
  FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can create folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their folders" ON folders
  FOR UPDATE USING (auth.uid() = created_by);

-- 未読ユーザーテーブル
ALTER TABLE non_read_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their read status" ON non_read_users
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their read status" ON non_read_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify their read status" ON non_read_users
  FOR UPDATE USING (auth.uid() = user_id);

-- 一時的な友達関係テーブル
ALTER TABLE tmp_friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their friend requests" ON tmp_friends
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = requested_id);
CREATE POLICY "Users can create friend requests" ON tmp_friends
  FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can respond to friend requests" ON tmp_friends
  FOR UPDATE USING (auth.uid() = requested_id OR auth.uid() = requester_id);
