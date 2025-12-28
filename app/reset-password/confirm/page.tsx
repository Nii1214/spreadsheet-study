'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

function ConfirmResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // URLパラメータからエラーを確認
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (errorParam) {
      if (errorParam === 'access_denied' || errorParam === 'otp_expired') {
        setError('リンクの有効期限が切れています。パスワードリセットリンクを再度取得してください。');
        setInitialized(true);
        return;
      }
      setError(errorDescription || 'エラーが発生しました。');
      setInitialized(true);
      return;
    }

    // セッションを確認
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError('無効なリンクです。パスワードリセットリンクを再度取得してください。');
        setInitialized(true);
        return;
      }

      // セッションが存在する場合、パスワードリセット用のセッションか確認
      // パスワードリセット用のセッションは通常、一時的なもの
      setInitialized(true);
    };

    checkSession();
  }, [searchParams, supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      setError('パスワードは6文字以上である必要があります');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // パスワード更新成功後、ログイン画面にリダイレクト
      alert('パスワードを更新しました。新しいパスワードでログインしてください。');
      router.push('/login');
    } catch (err) {
      setError('パスワードの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border rounded-lg bg-card p-8 text-center">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          ログイン画面に戻る
        </Link>

        <div className="border rounded-lg bg-card p-8">
          <h1 className="text-3xl font-bold mb-2">新しいパスワードを設定</h1>
          <p className="text-muted-foreground mb-6">
            新しいパスワードを入力してください。
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                新しいパスワード
              </label>
              <Input
                id="password"
                type="password"
                placeholder="6文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                パスワード（確認）
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="パスワードを再入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !initialized}
            >
              {loading ? '更新中...' : 'パスワードを更新'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="border rounded-lg bg-card p-8 text-center">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <ConfirmResetPasswordForm />
    </Suspense>
  );
}
