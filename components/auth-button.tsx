'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useIsAdmin } from '@/lib/supabase/profile-client';
import type { User } from '@supabase/supabase-js';
import { Settings } from 'lucide-react';

export function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: adminLoading, profile } = useIsAdmin();
  const supabase = createClient();

  useEffect(() => {
    // 現在のユーザーを取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading || adminLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" disabled>
          読み込み中...
        </Button>
      </div>
    );
  }

  if (user) {
    // デバッグ情報: プロフィールの状態を表示
    const profileStatus = profile
      ? `[${profile.role}]`
      : '[データなし]';

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-white/80">
          {user.email}
        </span>
        <span className="text-xs text-white/60" title={`プロフィール状態: ${profileStatus}`}>
          {profileStatus}
        </span>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:bg-white/10"
          >
            <Link href="/admin">
              <Settings className="h-4 w-4 mr-1" />
              管理者
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white hover:bg-white/10"
        >
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login" className="text-white hover:bg-white/10">
          ログイン
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/signup">はじめる</Link>
      </Button>
    </div>
  );
}

