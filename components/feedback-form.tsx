'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface FeedbackFormProps {
    nextSection?: {
        slug: string;
        title: string;
    } | null;
    prevSection?: {
        slug: string;
        title: string;
    } | null;
    service: string;
    chapterSlug: string;
}

export function FeedbackForm({
    nextSection,
    prevSection,
    service,
    chapterSlug,
}: FeedbackFormProps) {
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const minLength = 200;
    const currentLength = feedback.length;
    const isValid = currentLength >= minLength;

    const handleSubmit = () => {
        if (isValid) {
            setIsSubmitted(true);
            // ここで実際の送信処理を実装できます
            // 今回は見た目だけなので、状態を更新するだけ
        }
    };

    return (
        <>
            <div className="mt-12 pt-8 border-t mb-4">
                <h2 className="text-2xl font-semibold mb-4">感想を書く</h2>
                <div className="space-y-4">
                    <div>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="このセクションの感想を書いてください（200文字以上）"
                            className="min-h-[120px] resize-y"
                            rows={5}
                        />
                        <div className="mt-2 flex items-center justify-between">
                            <p
                                className={`text-sm ${isValid
                                    ? 'text-muted-foreground'
                                    : 'text-destructive'
                                    }`}
                            >
                                {isSubmitted && isValid
                                    ? '✓ 送信済み（再送信可能）'
                                    : isValid
                                        ? '✓ 文字数が十分です'
                                        : `あと${minLength - currentLength}文字必要です`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {currentLength} / {minLength}文字以上
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            disabled={!isValid}
                            onClick={handleSubmit}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${isValid
                                ? 'bg-sheets text-white hover:bg-sheets-light cursor-pointer'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                        >
                            {isSubmitted ? '再送信' : '送信'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 前後のセクションナビゲーション */}
            <div className="flex justify-between items-center pt-8 border-t">
                {prevSection ? (
                    <Link
                        href={`/lessons/${service}/${chapterSlug}/${prevSection.slug}`}
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
                    isSubmitted ? (
                        <Link
                            href={`/lessons/${service}/${chapterSlug}/${nextSection.slug}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-right"
                        >
                            <div>
                                <p className="text-xs text-muted-foreground">次のセクション</p>
                                <p className="font-semibold">{nextSection.title}</p>
                            </div>
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground text-right cursor-not-allowed opacity-50">
                            <div>
                                <p className="text-xs text-muted-foreground">次のセクション</p>
                                <p className="font-semibold">{nextSection.title}</p>
                            </div>
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </div>
                    )
                ) : (
                    <div />
                )}
            </div>
        </>
    );
}
