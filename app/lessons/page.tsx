import Link from 'next/link';
import { getAllLessons } from '@/lib/lessons';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">講座一覧</h1>
          <p className="text-muted-foreground">
            スプレッドシートの実務力を向上させるための講座を学びましょう
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">講座がまだ登録されていません</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                className="group"
              >
                <div className="h-full p-6 border rounded-lg bg-card hover:bg-accent transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-sheets-pale rounded-md">
                      <BookOpen className="h-5 w-5 text-sheets" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {lesson.metadata.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.metadata.description}
                      </p>
                    </div>
                  </div>

                  {lesson.metadata.sections && lesson.metadata.sections.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        {lesson.metadata.sections.length} セクション
                      </p>
                      <ul className="space-y-1">
                        {lesson.metadata.sections
                          .sort((a, b) => a.order - b.order)
                          .slice(0, 3)
                          .map((section) => (
                            <li
                              key={section.id}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <ChevronRight className="h-3 w-3" />
                              {section.title}
                            </li>
                          ))}
                        {lesson.metadata.sections.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{lesson.metadata.sections.length - 3} セクション
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-sm text-sheets group-hover:underline">
                    詳細を見る
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

