import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

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
    monthlySales: Array<{
        month: string;
        sales: number;
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

export interface ReviewActivityResponse {
    success: boolean;
    groupBy: string | null;
    months: number;
    data?: Array<{ month: string; reviewCount: number }>;
    series?: Array<{
        groupValue: string;
        data: Array<{ month: string; reviewCount: number }>;
    }>;
    totals?: Array<{ month: string; reviewCount: number }>;
}

export function useDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [reviewActivity, setReviewActivity] = useState<ReviewActivityResponse | null>(null);
    const [scatterData, setScatterData] = useState<any[] | null>(null);
    
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [isLoadingReviewActivity, setIsLoadingReviewActivity] = useState(false);
    const [isLoadingScatter, setIsLoadingScatter] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        if (!user) return;
        setIsLoadingStats(true);
        setError(null);
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data);
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to load dashboard stats:', err);
                setError(err.response?.data?.error || 'Failed to load dashboard stats.');
            }
        } finally {
            setIsLoadingStats(false);
        }
    }, [user]);

    const fetchInsights = useCallback(async () => {
        if (!user) return;
        setIsLoadingInsights(true);
        try {
            const res = await api.get('/dashboard/insights');
            setInsights(res.data.insights);
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to load AI insights:', err);
            }
        } finally {
            setIsLoadingInsights(false);
        }
    }, [user]);

    const fetchReviewActivity = useCallback(async (months = 6, groupBy?: 'category' | 'domain') => {
        if (!user) return null;
        setIsLoadingReviewActivity(true);
        try {
            const params = new URLSearchParams({ months: months.toString() });
            if (groupBy) params.append('groupBy', groupBy);
            
            const res = await api.get(`/dashboard/review-activity?${params.toString()}`);
            setReviewActivity(res.data);
            return res.data;
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to load review activity:', err);
            }
            return null;
        } finally {
            setIsLoadingReviewActivity(false);
        }
    }, [user]);

    const fetchScatterData = useCallback(async () => {
        if (!user) return null;
        setIsLoadingScatter(true);
        try {
            const res = await api.get('/dashboard/price-rating-scatter');
            setScatterData(res.data.data);
            return res.data.data;
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to load scatter data:', err);
            }
            return null;
        } finally {
            setIsLoadingScatter(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchStats();
            fetchInsights();
            fetchScatterData();
        }
    }, [user, fetchStats, fetchInsights, fetchScatterData]);

    return {
        stats,
        insights,
        reviewActivity,
        scatterData,
        isLoadingStats,
        isLoadingInsights,
        isLoadingReviewActivity,
        isLoadingScatter,
        error,
        fetchReviewActivity,
        fetchScatterData,
        refresh: () => {
            fetchStats();
            fetchInsights();
            fetchScatterData();
        }
    };
}
