import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 講座のメタデータの型定義
export interface LessonSection {
  id: string;
  title: string;
  order: number;
}

export interface LessonMetadata {
  title: string;
  description: string;
  order: number;
  sections: LessonSection[];
}

export interface Lesson {
  slug: string;
  metadata: LessonMetadata;
  content: string;
}

export interface LessonListItem {
  slug: string;
  metadata: LessonMetadata;
}

// content/lessonsディレクトリのパス
const lessonsDirectory = path.join(process.cwd(), 'content/lessons');

/**
 * すべての講座のメタデータを取得
 */
export function getAllLessons(): LessonListItem[] {
  // content/lessonsディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(lessonsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(lessonsDirectory);
  const allLessonsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(lessonsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        metadata: data as LessonMetadata,
      };
    });

  // orderでソート
  return allLessonsData.sort(
    (a, b) => a.metadata.order - b.metadata.order
  );
}

/**
 * 指定されたスラッグの講座を取得
 */
export function getLessonBySlug(slug: string): Lesson | null {
  const fullPath = path.join(lessonsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: data as LessonMetadata,
    content,
  };
}

/**
 * すべての講座のスラッグを取得
 */
export function getAllLessonSlugs(): string[] {
  if (!fs.existsSync(lessonsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(lessonsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

