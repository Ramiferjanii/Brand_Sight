import { useState, useCallback } from 'react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Review {
    id: string;
    productId: string;
    title: string | null;
    body: string | null;
    rating: number | null;
    author: string | null;
    sentiment: 'positive' | 'neutral' | 'negative' | null;
    compound: number | null;
    asin: string | null;
    createdAt: string;
}

export interface ReviewSummary {
    total: number;
    positive: number;
    neutral: number;
    negative: number;
    averageRating: number;
    averageCompound: number;
    overallSentiment: 'positive' | 'neutral' | 'negative';
}

export interface AiVerdict {
    pros: string[];
    cons: string[];
    verdict: string;
    hasData: boolean;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useReviews(productId: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [summary, setSummary] = useState<ReviewSummary | null>(null);
    const [aiVerdict, setAiVerdict] = useState<AiVerdict | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        setIsLoadingSummary(true);
        setError(null);
        try {
            const res = await api.get(`/reviews/${productId}/summary`);
            setSummary(res.data.summary);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load summary.');
        } finally {
            setIsLoadingSummary(false);
        }
    }, [productId]);

    const fetchAiVerdict = useCallback(async () => {
        setIsLoadingAi(true);
        try {
            const res = await api.get(`/reviews/${productId}/ai-summary`);
            setAiVerdict(res.data.aiVerdict);
        } catch (err: any) {
            console.error('Failed to load AI verdict:', err);
        } finally {
            setIsLoadingAi(false);
        }
    }, [productId]);

    const fetchReviews = useCallback(async (page = 1, sentiment?: string) => {
        setIsLoadingReviews(true);
        setError(null);
        try {
            const params: Record<string, any> = { page, limit: 5 };
            if (sentiment) params.sentiment = sentiment;
            const res = await api.get(`/reviews/${productId}`, { params });
            setReviews(res.data.reviews);
            setPagination(res.data.pagination);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load reviews.');
        } finally {
            setIsLoadingReviews(false);
        }
    }, [productId]);

    const [trends, setTrends] = useState<{ year: string; count: number }[]>([]);
    const [isLoadingTrends, setIsLoadingTrends] = useState(false);

    const fetchTrends = useCallback(async () => {
        setIsLoadingTrends(true);
        try {
            const res = await api.get(`/reviews/${productId}/trends`);
            setTrends(res.data.trends);
        } catch (err) {
            console.error('Failed to load trends:', err);
        } finally {
            setIsLoadingTrends(false);
        }
    }, [productId]);

    const triggerFetch = useCallback(async (maxReviews = 20) => {
        setIsFetching(true);
        setError(null);
        try {
            await api.post(`/reviews/fetch/${productId}`, { maxReviews });
            // Reload data after successful fetch
            await Promise.all([fetchSummary(), fetchReviews(1), fetchAiVerdict(), fetchTrends()]);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch reviews from Amazon.');
        } finally {
            setIsFetching(false);
        }
    }, [productId, fetchSummary, fetchReviews, fetchAiVerdict, fetchTrends]);

    return {
        reviews,
        summary,
        aiVerdict,
        trends,
        pagination,
        isLoadingReviews,
        isLoadingSummary,
        isLoadingAi,
        isLoadingTrends,
        isFetching,
        error,
        fetchSummary,
        fetchReviews,
        fetchAiVerdict,
        fetchTrends,
        triggerFetch,
    };
}
