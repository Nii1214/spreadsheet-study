import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/supabase/profile';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ChaptersPage() {
    const admin = await isAdmin();

    if (!admin) {
        redirect('/');
    }

    const supabase = await createClient();
    const { data: chapters, error } = await supabase
        .from('chapters')
        .select(`
      *,
      services!inner(slug, display_name)
    `)
        .order('order', { ascending: true });

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
                        <h1 className="text-3xl font-bold tracking-tight">章管理</h1>
                    </div>
                    <Button asChild>
                        <Link href="/admin/chapters/new">
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
                                    <th className="px-4 py-3 text-left font-semibold">サービス</th>
                                    <th className="px-4 py-3 text-left font-semibold">スラッグ</th>
                                    <th className="px-4 py-3 text-left font-semibold">タイトル</th>
                                    <th className="px-4 py-3 text-left font-semibold">順序</th>
                                    <th className="px-4 py-3 text-right font-semibold">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chapters && chapters.length > 0 ? (
                                    chapters.map((chapter: any) => (
                                        <tr key={chapter.id} className="border-t">
                                            <td className="px-4 py-3">{chapter.services?.display_name || chapter.services?.slug}</td>
                                            <td className="px-4 py-3">{chapter.slug}</td>
                                            <td className="px-4 py-3">{chapter.title}</td>
                                            <td className="px-4 py-3">{chapter.order}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/chapters/${chapter.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            章が登録されていません
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

