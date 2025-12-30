'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useIsAdmin } from '@/lib/supabase/profile-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, adminLoading, router]);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmedSlug = slug.trim();

      // 同じslugの既存レコードを検索（最新バージョンを取得）
      const { data: existingService, error: searchError } = await supabase
        .from('services')
        .select('version, service_key')
        .eq('slug', trimmedSlug)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      let version: number;
      let serviceKey: string | undefined;

      if (existingService && !searchError) {
        // 既存のslugを使用し、バージョンを+1、service_keyを引き継ぐ
        version = existingService.version + 1;
        serviceKey = existingService.service_key;
      } else {
        // 新規作成：version=1、service_keyはDB側で自動生成
        version = 1;
        serviceKey = undefined;
      }

      // 現在のユーザーIDを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('ログインが必要です');
        return;
      }

      const insertData: any = {
        slug: trimmedSlug,
        title: title.trim(),
        version: version,
        order: order === '' ? 1 : Number(order),
        created_by: user.id,
      };

      // 新バージョン登録の場合は既存のservice_keyを使用
      if (serviceKey) {
        insertData.service_key = serviceKey;
      }

      const { error: insertError } = await supabase
        .from('services')
        .insert(insertData);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      setError('サービスの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          サービス一覧に戻る
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">サービス新規作成</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                スラッグ <span className="text-destructive">*</span>
              </label>
              <Input
                id="slug"
                type="text"
                placeholder="例: spreadsheet"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={loading}
                pattern="[a-z0-9-]+"
                title="小文字の英数字とハイフンのみ使用可能です"
              />
              <p className="text-sm text-muted-foreground">
                小文字の英数字とハイフンのみ使用可能です（例: spreadsheet, excel）
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                タイトル <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="例: 表計算ソフト（Excel / Googleスプレッドシート など）"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="order" className="text-sm font-medium">
                表示順 <span className="text-destructive">*</span>
              </label>
              <Input
                id="order"
                type="number"
                min="1"
                value={order}
                onChange={(e) => {
                  const value = e.target.value;
                  setOrder(value === '' ? '' : Number(value));
                }}
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                数値が小さいほど先に表示されます
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-sheets hover:bg-sheets-light"
              >
                {loading ? '作成中...' : '作成'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

