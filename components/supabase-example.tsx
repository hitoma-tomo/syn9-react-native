import { useAuth } from '@/hooks/use-auth';
import { signIn, signOut, signUp } from '@/lib/auth';
import { fetchData, insertData } from '@/lib/database';
import { Post } from '@/types/supabase';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const SupabaseExample: React.FC = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  // 投稿データを取得
  const loadPosts = async () => {
    const { data, error } = await fetchData<Post>('posts');
    if (error) {
      console.error('投稿の取得に失敗しました:', error);
    } else if (data) {
      setPosts(data);
    }
  };

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);
    if (error) {
      Alert.alert('エラー', 'サインアップに失敗しました');
    } else {
      Alert.alert('成功', '確認メールを送信しました');
    }
  };

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('エラー', 'サインインに失敗しました');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert('エラー', 'サインアウトに失敗しました');
    }
  };

  const createSamplePost = async () => {
    if (!user) return;
    
    const newPost = {
      title: 'サンプル投稿',
      content: 'これはSupabaseのテスト投稿です',
      author_id: user.id,
      published: true,
    };

    const { error } = await insertData('posts', newPost);
    if (error) {
      Alert.alert('エラー', '投稿の作成に失敗しました');
    } else {
      Alert.alert('成功', '投稿を作成しました');
      loadPosts(); // 投稿リストを更新
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Supabase認証</Text>
        
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>サインイン</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>サインアップ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ようこそ！</Text>
      <Text>ユーザーID: {user.id}</Text>
      <Text>メール: {user.email}</Text>
      
      <TouchableOpacity style={styles.button} onPress={createSamplePost}>
        <Text style={styles.buttonText}>サンプル投稿を作成</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>サインアウト</Text>
      </TouchableOpacity>
      
      <Text style={styles.subtitle}>投稿一覧</Text>
      {posts.map((post) => (
        <View key={post.id} style={styles.postItem}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text>{post.content}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  postItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    marginBottom: 10,
  },
  postTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
