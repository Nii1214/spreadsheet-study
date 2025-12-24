import Link from 'next/link';
import { getAllServices } from '@/lib/lessons';
import { Table, ChevronRight } from 'lucide-react';

// サービス名の表示名マッピング
const serviceDisplayNames: Record<string, string> = {
    spreadsheet: '表計算ソフト（Excel / Googleスプレッドシート など）',
    excel: 'Excel',
    word: 'Word',
};

export default function LessonsPage() {
    const services = getAllServices();

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">講座ジャンルを選択</h1>
                    <p className="text-muted-foreground">
                        学習したい講座のジャンルを選択してください
                    </p>
                </div>

                {services.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">講座がまだ登録されていません</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                        {services.map((service) => {
                            const displayName = serviceDisplayNames[service] || service;

                            return (
                                <Link
                                    key={service}
                                    href={`/lessons/${service}`}
                                    className="group"
                                >
                                    <div className="h-full p-8 border rounded-lg bg-card hover:bg-accent transition-colors">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="p-4 bg-sheets-pale rounded-lg mb-4">
                                                <Table className="h-8 w-8 text-sheets" />
                                            </div>
                                            <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {displayName}
                                            </h2>
                                            <div className="mt-4 flex items-center text-sm text-sheets group-hover:underline">
                                                選択する
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
