import { createClient } from './server';

export interface Profile {
  id: string; // user_idと同じ値
  role: string;
  created_at: string;
  updated_at: string;
}

/**
 * 現在のユーザーのプロフィールを取得
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}

/**
 * 現在のユーザーが管理者かどうかをチェック
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
}

