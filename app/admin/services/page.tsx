import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/supabase/profile';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ServicesPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect('/');
  }

  const supabase = await createClient();
  const { data: allServices, error } = await supabase
    .from('services')
    .select('*')
    .order('slug', { ascending: true })
    .order('version', { ascending: false });

  // 同じslugの最新バージョンのみを取得
  const services = allServices
    ? Array.from(
      allServices
        .reduce((map, service) => {
          const key = service.slug;
          if (!map.has(key) || map.get(key)!.version < service.version) {
            map.set(key, service);
          }
          return map;
        }, new Map<string, any>())
        .values()
    ).sort((a: any, b: any) => a.slug.localeCompare(b.slug))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              管理者画面に戻る
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">講座管理</h1>
          </div>
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Link>
          </Button>
        </div>

        {error ? (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            エラーが発生しました: {error.message}
          </div>
        ) : (
          <div className="border rounded-lg bg-card">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">スラッグ</th>
                  <th className="px-4 py-2 text-left font-semibold">タイトル</th>
                  <th className="px-4 py-2 text-left font-semibold">作成日時</th>
                  <th className="px-4 py-2 text-right font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {services && services.length > 0 ? (
                  services.map((service: any) => (
                    <tr key={service.id} className="border-t">
                      <td className="px-4 py-2">{service.slug}</td>
                      <td className="px-4 py-2">{service.title}</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">
                        {new Date(service.created_at).toLocaleString('ja-JP')}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/services/${service.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      サービスが登録されていません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

