import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  getChapterByServiceAndSlug,
  getSectionByServiceChapterAndSlug,
  getAllServices,
  getChaptersByService,
} from '@/lib/lessons';

interface SectionPageProps {
  params: Promise<{ service: string; slug: string; section: string }>;
}

// 静的生成用のパラメータを生成
export async function generateStaticParams() {
  const services = getAllServices();
  const params: Array<{ service: string; slug: string; section: string }> =
    [];

  services.forEach((service) => {
    const chapters = getChaptersByService(service);
    chapters.forEach((chapter) => {
      const fullChapter = getChapterByServiceAndSlug(service, chapter.slug);
      if (fullChapter) {
        fullChapter.sections.forEach((section) => {
          params.push({
            service,
            slug: chapter.slug,
            section: section.slug,
          });
        });
      }
    });
  });

  return params;
}

// メタデータを生成
export async function generateMetadata({ params }: SectionPageProps) {
  const { service, slug, section } = await params;
  const chapter = getChapterByServiceAndSlug(service, slug);
  const sectionData = getSectionByServiceChapterAndSlug(service, slug, section);

  if (!chapter || !sectionData) {
    return {
      title: 'セクションが見つかりません',
    };
  }

  return {
    title: `${sectionData.title} - ${chapter.metadata.title}`,
    description: `${chapter.metadata.title}の${sectionData.title}セクション`,
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { service, slug, section } = await params;
  const chapter = getChapterByServiceAndSlug(service, slug);
  const sectionData = getSectionByServiceChapterAndSlug(service, slug, section);

  if (!chapter || !sectionData) {
    notFound();
  }

  // 前後のセクションを取得
  const sortedSections = chapter.sections.sort((a, b) => a.order - b.order);
  const currentIndex = sortedSections.findIndex((s) => s.slug === section);
  const prevSection =
    currentIndex > 0 ? sortedSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < sortedSections.length - 1
      ? sortedSections[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <Link
          href={`/lessons/${service}/${slug}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          章に戻る
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sheets-pale rounded-md">
                <BookOpen className="h-5 w-5 text-sheets" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {chapter.metadata.title}
                </p>
                <h1 className="text-4xl font-bold tracking-tight">
                  {sectionData.title}
                </h1>
              </div>
            </div>
          </div>

          {/* マークダウンコンテンツ */}
          <article className="markdown-content mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl font-bold mt-8 mb-4 pb-2 border-b scroll-mt-4"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl font-semibold mt-6 mb-3"
                    {...props}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    className="text-lg font-semibold mt-4 mb-2"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-7" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),
                // テーブルのスタイリング
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table
                      {...props}
                      className="min-w-full border-collapse border border-border"
                    />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-muted" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="border border-border px-4 py-2 text-left font-semibold"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="border border-border px-4 py-2"
                    {...props}
                  />
                ),
                // コードブロックのスタイリング
                code: ({ node, className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code
                      className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-muted p-4 rounded-lg overflow-x-auto mb-4"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-sheets hover:underline"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold" {...props} />
                ),
              }}
            >
              {sectionData.content}
            </ReactMarkdown>
          </article>

          {/* 前後のセクションナビゲーション */}
          <div className="flex justify-between items-center pt-8 border-t">
            {prevSection ? (
              <Link
                href={`/lessons/${service}/${slug}/${prevSection.slug}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <div>
                  <p className="text-xs text-muted-foreground">前のセクション</p>
                  <p className="font-semibold">{prevSection.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextSection ? (
              <Link
                href={`/lessons/${service}/${slug}/${nextSection.slug}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-right"
              >
                <div>
                  <p className="text-xs text-muted-foreground">次のセクション</p>
                  <p className="font-semibold">{nextSection.title}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
