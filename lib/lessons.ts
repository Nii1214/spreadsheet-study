import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// セクションの型定義
export interface Section {
    slug: string;
    title: string;
    order: number;
    content: string;
}

// 章（講座）のメタデータの型定義
export interface ChapterMetadata {
    title: string;
    description: string;
    service: string;
    order: number;
}

export interface Chapter {
    slug: string;
    metadata: ChapterMetadata;
    sections: Section[];
}

export interface ChapterListItem {
    slug: string;
    metadata: ChapterMetadata;
    sectionCount: number;
}

// content/lessonsディレクトリのパス
const lessonsDirectory = path.join(process.cwd(), 'content/lessons');

/**
 * 指定されたサービスの章一覧を取得
 */
export function getChaptersByService(service: string): ChapterListItem[] {
    const serviceDirectory = path.join(lessonsDirectory, service);

    if (!fs.existsSync(serviceDirectory)) {
        return [];
    }

    const chapterDirs = fs
        .readdirSync(serviceDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    const chapters = chapterDirs
        .map((chapterSlug) => {
            const chapterDir = path.join(serviceDirectory, chapterSlug);
            const chapterMetaPath = path.join(chapterDir, 'chapter.md');

            if (!fs.existsSync(chapterMetaPath)) {
                return null;
            }

            const chapterMetaContent = fs.readFileSync(chapterMetaPath, 'utf8');
            const { data } = matter(chapterMetaContent);

            // セクションファイルの数を取得
            const sectionFiles = fs
                .readdirSync(chapterDir)
                .filter((fileName) => fileName.startsWith('section-') && fileName.endsWith('.md'));

            return {
                slug: chapterSlug,
                metadata: data as ChapterMetadata,
                sectionCount: sectionFiles.length,
            };
        })
        .filter((chapter): chapter is ChapterListItem => chapter !== null);

    // orderでソート
    return chapters.sort((a, b) => a.metadata.order - b.metadata.order);
}

/**
 * すべてのサービス名を取得
 */
export function getAllServices(): string[] {
    if (!fs.existsSync(lessonsDirectory)) {
        return [];
    }

    const services = fs
        .readdirSync(lessonsDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    return services.sort();
}

/**
 * サービス別にグループ化された章を取得
 */
export function getChaptersByServiceGrouped(): Record<string, ChapterListItem[]> {
    const services = getAllServices();
    const grouped: Record<string, ChapterListItem[]> = {};

    services.forEach((service) => {
        grouped[service] = getChaptersByService(service);
    });

    return grouped;
}

/**
 * 指定されたサービスとスラッグの章を取得
 */
export function getChapterByServiceAndSlug(
    service: string,
    chapterSlug: string
): Chapter | null {
    const chapterDir = path.join(lessonsDirectory, service, chapterSlug);

    if (!fs.existsSync(chapterDir)) {
        return null;
    }

    const chapterMetaPath = path.join(chapterDir, 'chapter.md');

    if (!fs.existsSync(chapterMetaPath)) {
        return null;
    }

    const chapterMetaContent = fs.readFileSync(chapterMetaPath, 'utf8');
    const { data } = matter(chapterMetaContent);

    const metadata = data as ChapterMetadata;

    // サービスが一致するか確認
    if (metadata.service !== service) {
        return null;
    }

    // セクションファイルを取得
    const sectionFiles = fs
        .readdirSync(chapterDir)
        .filter((fileName) => fileName.startsWith('section-') && fileName.endsWith('.md'))
        .sort(); // ファイル名でソート（section-1.md, section-2.md の順）

    const sections: Section[] = sectionFiles.map((fileName) => {
        const sectionPath = path.join(chapterDir, fileName);
        const sectionContent = fs.readFileSync(sectionPath, 'utf8');
        const { data: sectionData, content } = matter(sectionContent);

        return {
            slug: fileName.replace(/\.md$/, ''),
            title: sectionData.title as string,
            order: sectionData.order as number,
            content,
        };
    });

    // orderでソート
    sections.sort((a, b) => a.order - b.order);

    return {
        slug: chapterSlug,
        metadata,
        sections,
    };
}

/**
 * 指定されたセクションを取得
 */
export function getSectionByServiceChapterAndSlug(
    service: string,
    chapterSlug: string,
    sectionSlug: string
): Section | null {
    const chapter = getChapterByServiceAndSlug(service, chapterSlug);

    if (!chapter) {
        return null;
    }

    const section = chapter.sections.find((s) => s.slug === sectionSlug);

    return section || null;
}
