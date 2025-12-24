import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, List } from 'lucide-react';
import {
  getChapterByServiceAndSlug,
  getAllServices,
  getChaptersByService,
} from '@/lib/lessons';

interface ChapterPageProps {
  params: Promise<{ service: string; slug: string }>;
}

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const services = getAllServices();
  const params: Array<{ service: string; slug: string }> = [];

  services.forEach((service) => {
    const chapters = getChaptersByService(service);
    chapters.forEach((chapter) => {
      params.push({
        service,
        slug: chapter.slug,
      });
    });
  });

  return params;
}

// メタデータを生成
export async function generateMetadata({ params }: ChapterPageProps) {
  const { service, slug } = await params;
  const chapter = getChapterByServiceAndSlug(service, slug);

  if (!chapter) {
    return {
      title: '章が見つかりません',
    };
  }

  return {
    title: chapter.metadata.title,
    description: chapter.metadata.description,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { service, slug } = await params;
  const chapter = getChapterByServiceAndSlug(service, slug);

  if (!chapter) {
    notFound();
  }

  const sortedSections = chapter.sections.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <Link
          href={`/lessons/${service}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          章一覧に戻る
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sheets-pale rounded-md">
                <BookOpen className="h-5 w-5 text-sheets" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                {chapter.metadata.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {chapter.metadata.description}
            </p>
          </div>

          {/* セクション一覧 */}
          {sortedSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">セクションがまだ登録されていません</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <List className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">セクション一覧</h2>
                <span className="text-sm text-muted-foreground">
                  ({sortedSections.length}セクション)
                </span>
              </div>

              <div className="grid gap-4">
                {sortedSections.map((section) => (
                  <Link
                    key={section.slug}
                    href={`/lessons/${service}/${slug}/${section.slug}`}
                    className="group"
                  >
                    <div className="p-6 border rounded-lg bg-card hover:bg-accent transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sheets-pale flex items-center justify-center text-sheets font-semibold">
                          {section.order}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {section.title}
                          </h3>
                          <div className="flex items-center text-sm text-sheets group-hover:underline">
                            学習を開始する
                            <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
