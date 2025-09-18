import { supabase } from './supabase';

// 汎用的なデータベース操作ヘルパー関数

// テーブルからデータを取得
export const fetchData = async <T>(tableName: string, select = '*') => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(select);
    
    if (error) throw error;
    return { data: data as T[], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 条件付きでデータを取得
export const fetchDataWithFilter = async <T>(
  tableName: string, 
  column: string, 
  value: any, 
  select = '*'
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .eq(column, value);
    
    if (error) throw error;
    return { data: data as T[], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// IDでデータを取得
export const fetchDataById = async <T>(
  tableName: string, 
  id: string | number, 
  select = '*'
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data: data as T, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// データを挿入
export const insertData = async <T>(tableName: string, values: Partial<T>) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([values])
      .select();
    
    if (error) throw error;
    return { data: data as T[], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// データを更新
export const updateData = async <T>(
  tableName: string, 
  id: string | number, 
  values: Partial<T>
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(values)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data: data as T[], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// データを削除
export const deleteData = async (tableName: string, id: string | number) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// リアルタイム購読
export const subscribeToTable = <T>(
  tableName: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: tableName,
        filter: filter 
      },
      callback
    )
    .subscribe();

  return channel;
};
