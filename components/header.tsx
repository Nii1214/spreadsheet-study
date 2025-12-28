'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HeaderLoggedIn } from '@/components/header-logged-in';
import { HeaderLoggedOut } from '@/components/header-logged-out';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 現在のユーザーを取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // ローディング中はログアウト状態のヘッダーを表示
  if (isLoggedIn === null) {
    return <HeaderLoggedOut />;
  }

  return isLoggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />;
}