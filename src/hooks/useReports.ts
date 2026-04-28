import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface MarketReport {
    marketMood: string;
    averagePricingInsight: string;
    strengths: string[];
    weaknesses: string[];
    growthPotential: string;
    conclusion: string;
}

export function useReports() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<string[]>([]);
    const [report, setReport] = useState<MarketReport | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!user) return;
        setIsLoadingCategories(true);
        try {
            const res = await api.get('/reports/categories');
            setCategories(res.data.categories);
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to fetch categories:', err);
            }
        } finally {
            setIsLoadingCategories(false);
        }
    }, [user]);

    const generateReport = useCallback(async (category: string) => {
        if (!user) return;
        setIsGenerating(true);
        setError(null);
        try {
            const res = await api.post('/reports/generate', { category });
            setReport(res.data.report);
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to generate report:', err);
                setError(err.response?.data?.error || 'Failed to generate report');
            }
        } finally {
            setIsGenerating(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCategories();
        }
    }, [user, fetchCategories]);

    return {
        categories,
        report,
        isLoadingCategories,
        isGenerating,
        error,
        generateReport
    };
}
