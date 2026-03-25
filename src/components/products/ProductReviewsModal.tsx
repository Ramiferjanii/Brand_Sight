'use client';

import React, { useEffect, useState } from 'react';
import { useReviews, Review } from '@/hooks/useReviews';

interface ProductReviewsModalProps {
    productId: string;
    productName: string;
    onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number | null }) {
    const r = Math.round(rating ?? 0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    className={`h-3.5 w-3.5 ${s <= r ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.951 2.878c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
            ))}
        </div>
    );
}

function SentimentBadge({ sentiment }: { sentiment: Review['sentiment'] }) {
    const map: Record<string, { label: string; cls: string }> = {
        positive: { label: '😊 Positive', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
        neutral:  { label: '😐 Neutral',  cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
        negative: { label: '😞 Negative', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    };
    if (!sentiment) return null;
    const { label, cls } = map[sentiment] ?? map['neutral'];
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

function SummaryBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="w-16 text-gray-500 dark:text-gray-400">{label}</span>
            <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="w-6 text-right font-medium text-gray-700 dark:text-gray-200">{count}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const SENTIMENTS = [
    { value: '', label: 'All' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' },
];

export const ProductReviewsModal: React.FC<ProductReviewsModalProps> = ({
    productId,
    productName,
    onClose,
}) => {
    const {
        reviews, summary, aiVerdict, pagination,
        isLoadingReviews, isLoadingSummary, isLoadingAi, isFetching, error,
        fetchSummary, fetchReviews, fetchAiVerdict, triggerFetch,
    } = useReviews(productId);

    const [page, setPage] = useState(1);
    const [sentiment, setSentiment] = useState('');

    useEffect(() => {
        fetchSummary();
        fetchAiVerdict();
        fetchReviews(1);
    }, [fetchSummary, fetchReviews, fetchAiVerdict]);

    const handleSentimentChange = (s: string) => {
        setSentiment(s);
        setPage(1);
        fetchReviews(1, s || undefined);
    };

    const handlePage = (newPage: number) => {
        setPage(newPage);
        fetchReviews(newPage, sentiment || undefined);
    };

    // Trap scroll/click outside
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-24 pb-8 px-4 sm:pt-28"
            onClick={handleBackdropClick}
        >
            <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-900 max-h-full overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">Reviews</p>
                        <h2 className="mt-0.5 text-base font-bold text-gray-900 dark:text-white line-clamp-1">{productName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* ── Summary Card ── */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                        {isLoadingSummary ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
                                Loading summary…
                            </div>
                        ) : summary && summary.total > 0 ? (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                                {/* Score bubble */}
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-gray-900 min-w-[90px]">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {summary.averageRating.toFixed(1)}
                                    </span>
                                    <StarRating rating={summary.averageRating} />
                                    <span className="mt-1 text-xs text-gray-400">{summary.total} reviews</span>
                                </div>
                                {/* Bars */}
                                <div className="flex flex-1 flex-col gap-2">
                                    <SummaryBar label="Positive" count={summary.positive} total={summary.total} color="bg-emerald-400" />
                                    <SummaryBar label="Neutral"  count={summary.neutral}  total={summary.total} color="bg-gray-400" />
                                    <SummaryBar label="Negative" count={summary.negative} total={summary.total} color="bg-red-400" />
                                    <div className="mt-1 flex items-center gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Overall sentiment:</span>
                                        <SentimentBadge sentiment={summary.overallSentiment} />
                                        <span className="ml-auto text-xs text-gray-400">
                                            Compound: <span className="font-medium text-gray-600 dark:text-gray-300">{summary.averageCompound.toFixed(3)}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-1">
                                No reviews yet. Click <strong>Fetch Reviews</strong> below to scrape from Amazon.
                            </p>
                        )}
                    </div>

                    {/* ── AI Verdict Card ── */}
                    {isLoadingAi ? (
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/20">
                            <div className="flex items-center gap-2 text-sm text-indigo-500">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                                Analyzing reviews with Groq AI…
                            </div>
                        </div>
                    ) : aiVerdict && aiVerdict.hasData && (
                        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-5 dark:border-indigo-900/50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 text-6xl opacity-5">✨</div>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-3 uppercase tracking-wider">
                                <span>✨</span> AI Verdict
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2 uppercase flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                                        Pros
                                    </h4>
                                    <ul className="space-y-1">
                                        {aiVerdict.pros.map((pro, i) => (
                                            <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                                                <span className="mr-1.5 text-emerald-500">•</span>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2 uppercase flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/></svg>
                                        Cons
                                    </h4>
                                    <ul className="space-y-1">
                                        {aiVerdict.cons.map((con, i) => (
                                            <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                                                <span className="mr-1.5 text-red-500">•</span>
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-indigo-100/60 dark:border-indigo-800/60">
                                <p className="text-sm text-indigo-950 dark:text-indigo-100 italic font-medium leading-relaxed">
                                    "{aiVerdict.verdict}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Error Banner ── */}
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* ── Filters ── */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Filter:</span>
                        {SENTIMENTS.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => handleSentimentChange(s.value)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    sentiment === s.value
                                        ? 'bg-brand-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Review List ── */}
                    {isLoadingReviews ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800/60"
                                >
                                    <div className="mb-1 flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
                                                {review.title || 'No title'}
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <StarRating rating={review.rating} />
                                                {review.author && (
                                                    <span className="text-xs text-gray-400">by {review.author}</span>
                                                )}
                                            </div>
                                        </div>
                                        <SentimentBadge sentiment={review.sentiment} />
                                    </div>
                                    {review.body && (
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                                            {review.body}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-400 py-4">No reviews found for this filter.</p>
                    )}

                    {/* ── Pagination ── */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePage(page - 1)}
                                disabled={page <= 1}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                ← Prev
                            </button>
                            <span className="text-xs text-gray-500">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePage(page + 1)}
                                disabled={page >= pagination.totalPages}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Footer / Fetch Action ── */}
                <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
                    <button
                        onClick={() => triggerFetch(20)}
                        disabled={isFetching}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60 transition-all"
                    >
                        {isFetching ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Fetching from Amazon…
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Fetch / Update Reviews from Amazon
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
