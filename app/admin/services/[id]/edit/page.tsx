'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useIsAdmin } from '@/lib/supabase/profile-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { ArrowLeft, X } from 'lucide-react';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [slug, setSlug] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    if (!isAdmin || !serviceId) return;

    const fetchService = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) {
        setError('サービスの取得に失敗しました');
        setLoadingData(false);
        return;
      }

      if (data) {
        setSlug(data.slug);
        setOriginalSlug(data.slug);
        setTitle(data.title);
        setOrder(data.order ?? '');
      }
      setLoadingData(false);
    };

    fetchService();
  }, [supabase, isAdmin, serviceId]);

  if (adminLoading || loadingData) {
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

    const trimmedSlug = slug.trim();

    // slugが変更されている場合、ダイアログを表示
    if (trimmedSlug !== originalSlug) {
      setPendingSubmit(true);
      setShowDialog(true);
      return;
    }

    // slugが変更されていない場合、通常の処理を実行
    await performSubmit(trimmedSlug);
  };

  const performSubmit = async (trimmedSlug: string) => {
    setLoading(true);
    setShowDialog(false);
    setPendingSubmit(false);

    try {
      // 現在のサービスのversionとservice_keyを取得
      const { data: currentService, error: currentError } = await supabase
        .from('services')
        .select('version, service_key')
        .eq('id', serviceId)
        .single();

      if (currentError || !currentService) {
        setError('サービスの取得に失敗しました');
        return;
      }

      const newVersion = currentService.version + 1;

      // 現在のユーザーIDを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('ログインが必要です');
        return;
      }

      // バージョンを+1して新規登録（既存のservice_keyを引き継ぐ）
      const { error: insertError } = await supabase
        .from('services')
        .insert({
          slug: trimmedSlug,
          title: title.trim(),
          version: newVersion,
          order: order === '' ? 1 : Number(order),
          created_by: user.id,
          service_key: currentService.service_key,
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      setError('サービスの更新に失敗しました');
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
          <h1 className="text-3xl font-bold tracking-tight mb-6">サービス編集（新バージョン作成）</h1>

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
                {loading ? '登録中...' : '新バージョンとして登録'}
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

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogClose onClick={() => {
                setShowDialog(false);
                setPendingSubmit(false);
              }}>
                <X className="h-4 w-4" />
              </DialogClose>
              <DialogHeader>
                <DialogTitle>スラッグが変更されています</DialogTitle>
                <DialogDescription>
                  スラッグを変更すると、新バージョンではなく完全新規のサービスとして作成されます。
                  既存のサービスとのバージョン管理は行われません。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setPendingSubmit(false);
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={() => performSubmit(slug.trim())}
                  className="bg-sheets hover:bg-sheets-light"
                >
                  完全新規として作成
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

