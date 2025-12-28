import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/supabase/profile';
import Link from 'next/link';
import { Settings, BookOpen, FileText, Layers } from 'lucide-react';

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">管理者画面</h1>
          <p className="text-muted-foreground">
            サービス・章・セクションの管理を行います
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/services"
            className="group"
          >
            <div className="h-full p-6 border rounded-lg bg-card hover:bg-accent transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-sheets-pale rounded-md">
                  <Layers className="h-6 w-6 text-sheets" />
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  サービス管理
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                サービスの作成・編集・削除を行います
              </p>
            </div>
          </Link>

          <Link
            href="/admin/chapters"
            className="group"
          >
            <div className="h-full p-6 border rounded-lg bg-card hover:bg-accent transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-sheets-pale rounded-md">
                  <BookOpen className="h-6 w-6 text-sheets" />
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  章管理
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                章の作成・編集・削除を行います
              </p>
            </div>
          </Link>

          <Link
            href="/admin/sections"
            className="group"
          >
            <div className="h-full p-6 border rounded-lg bg-card hover:bg-accent transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-sheets-pale rounded-md">
                  <FileText className="h-6 w-6 text-sheets" />
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  セクション管理
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                セクションの作成・編集・削除を行います
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

