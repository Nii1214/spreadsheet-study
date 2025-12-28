'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password/confirm`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('パスワードリセットに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border rounded-lg bg-card p-8">
            <h1 className="text-3xl font-bold mb-2">メールを確認してください</h1>
            <p className="text-muted-foreground mb-6">
              {email} にパスワードリセット用のリンクを送信しました。
              メール内のリンクをクリックして、新しいパスワードを設定してください。
            </p>
            <Button asChild className="w-full">
              <Link href="/login">ログイン画面に戻る</Link>
            </Button>
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
          <h1 className="text-3xl font-bold mb-2">パスワードをリセット</h1>
          <p className="text-muted-foreground mb-6">
            登録されているメールアドレスを入力してください。
            パスワードリセット用のリンクを送信します。
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '送信中...' : 'リセットリンクを送信'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

