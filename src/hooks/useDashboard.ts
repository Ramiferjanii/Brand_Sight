import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface DashboardStats {
    websiteCount: number;
    productCount: number;
    reviewCount: number;
    avgRating: number;
    sentimentBreakdown: {
        positive: number;
        neutral: number;
        negative: number;
    };
    recentScrapes: number;
    domainDistribution: Array<{
        domain: string;
        count: number;
    }>;
    categoryPrices: Array<{
        category: string;
        avgPrice: number;
        count: number;
    }>;
    domainReviews: Array<{
        domain: string;
        count: number;
    }>;
    ratingDistribution: Array<{
        rating: number;
        count: number;
    }>;
}

export interface DashboardInsights {
    summary: string;
    topInsight: string;
    tips: string[];
}

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setIsLoadingStats(true);
        setError(null);
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data);
        } catch (err: any) {
            console.error('Failed to load dashboard stats:', err);
            setError(err.response?.data?.error || 'Failed to load dashboard stats.');
        } finally {
            setIsLoadingStats(false);
        }
    }, []);

    const fetchInsights = useCallback(async () => {
        setIsLoadingInsights(true);
        try {
            const res = await api.get('/dashboard/insights');
            setInsights(res.data.insights);
        } catch (err: any) {
            console.error('Failed to load AI insights:', err);
        } finally {
            setIsLoadingInsights(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        fetchInsights();
    }, [fetchStats, fetchInsights]);

    return {
        stats,
        insights,
        isLoadingStats,
        isLoadingInsights,
        error,
        refresh: () => {
            fetchStats();
            fetchInsights();
        }
    };
}
