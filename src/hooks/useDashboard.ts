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

export interface SalesVolumeResponse {
    success: boolean;
    groupBy: string | null;
    months: number;
    data?: Array<{ month: string; estimatedSales: number; reviewCount: number }>;
    series?: Array<{
        groupValue: string;
        data: Array<{ month: string; estimatedSales: number; reviewCount: number }>;
    }>;
    totals?: Array<{ month: string; estimatedSales: number; reviewCount: number }>;
}

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [salesVolume, setSalesVolume] = useState<SalesVolumeResponse | null>(null);
    
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [isLoadingSalesVolume, setIsLoadingSalesVolume] = useState(false);
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

    const fetchSalesVolume = useCallback(async (months = 6, groupBy?: 'category' | 'domain') => {
        setIsLoadingSalesVolume(true);
        try {
            const params = new URLSearchParams({ months: months.toString() });
            if (groupBy) params.append('groupBy', groupBy);
            
            const res = await api.get(`/dashboard/sales-volume?${params.toString()}`);
            setSalesVolume(res.data);
            return res.data;
        } catch (err: any) {
            console.error('Failed to load sales volume:', err);
            return null;
        } finally {
            setIsLoadingSalesVolume(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        fetchInsights();
    }, [fetchStats, fetchInsights]);

    return {
        stats,
        insights,
        salesVolume,
        isLoadingStats,
        isLoadingInsights,
        isLoadingSalesVolume,
        error,
        fetchSalesVolume,
        refresh: () => {
            fetchStats();
            fetchInsights();
        }
    };
}
