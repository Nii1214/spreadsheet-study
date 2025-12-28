import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/supabase/profile';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function SectionsPage() {
    const admin = await isAdmin();

    if (!admin) {
        redirect('/');
    }

    const supabase = await createClient();
    const { data: sections, error } = await supabase
        .from('sections')
        .select(`
      *,
      chapters!inner(
        slug,
        title,
        services!inner(slug, display_name)
      )
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
                        <h1 className="text-3xl font-bold tracking-tight">セクション管理</h1>
                    </div>
                    <Button asChild>
                        <Link href="/admin/sections/new">
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
                                    <th className="px-4 py-3 text-left font-semibold">章</th>
                                    <th className="px-4 py-3 text-left font-semibold">スラッグ</th>
                                    <th className="px-4 py-3 text-left font-semibold">タイトル</th>
                                    <th className="px-4 py-3 text-left font-semibold">順序</th>
                                    <th className="px-4 py-3 text-right font-semibold">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections && sections.length > 0 ? (
                                    sections.map((section: any) => (
                                        <tr key={section.id} className="border-t">
                                            <td className="px-4 py-3">
                                                {section.chapters?.services?.display_name || section.chapters?.services?.slug}
                                            </td>
                                            <td className="px-4 py-3">{section.chapters?.title}</td>
                                            <td className="px-4 py-3">{section.slug}</td>
                                            <td className="px-4 py-3">{section.title}</td>
                                            <td className="px-4 py-3">{section.order}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/sections/${section.id}/edit`}>
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
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            セクションが登録されていません
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

