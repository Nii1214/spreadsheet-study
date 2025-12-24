import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import {
  getChaptersByService,
  getAllServices,
} from '@/lib/lessons';

interface ServicePageProps {
  params: Promise<{ service: string }>;
}

// サービス名の表示名マッピング
const serviceDisplayNames: Record<string, string> = {
    spreadsheet: '表計算ソフト（Excel / Googleスプレッドシート など）',
    excel: 'Excel',
    word: 'Word',
};

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    service,
  }));
}

// メタデータを生成
export async function generateMetadata({ params }: ServicePageProps) {
  const { service } = await params;
  const displayName = serviceDisplayNames[service] || service;

  return {
    title: `${displayName} - 講座一覧`,
    description: `${displayName}の講座一覧`,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service } = await params;
  const chapters = getChaptersByService(service);
  const displayName = serviceDisplayNames[service] || service;

  if (chapters.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          ジャンル選択に戻る
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {displayName}
            </h1>
            <p className="text-muted-foreground">
              {chapters.length}章の講座が登録されています
            </p>
          </div>

          {/* 章一覧 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/lessons/${service}/${chapter.slug}`}
                className="group"
              >
                <div className="h-full p-6 border rounded-lg bg-card hover:bg-accent transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-sheets-pale rounded-md">
                      <BookOpen className="h-5 w-5 text-sheets" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {chapter.metadata.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {chapter.metadata.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      {chapter.sectionCount} セクション
                    </p>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-sheets group-hover:underline">
                    詳細を見る
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

