import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { useAuth } from '@/context/AuthContext';

export interface UseProductsOptions {
    page?: number;
    limit?: number;
    name?: string;
    minPrice?: string;
    maxPrice?: string;
    category?: string;
    websiteId?: string;
}

export function useProducts(initialOptions: UseProductsOptions = {}) {
    const { user } = useAuth();
    // Destructure to have stable dependencies
    const { 
        limit: initialLimit = 12, 
        page: initialPage = 1,
        name: initialName,
        minPrice: initialMinPrice,
        maxPrice: initialMaxPrice,
        category: initialCategory,
        websiteId: initialWebsiteId
    } = initialOptions;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (options: UseProductsOptions = {}) => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            
            // Merge destructured initial values with manual override options
            const p = options.page || page;
            const l = options.limit || initialLimit;
            const name = options.name || initialName;
            const min = options.minPrice || initialMinPrice;
            const max = options.maxPrice || initialMaxPrice;
            const cat = options.category || initialCategory;
            const web = options.websiteId || initialWebsiteId;

            params.append('page', p.toString());
            params.append('limit', l.toString());
            if (name) params.append('name', name);
            if (min) params.append('minPrice', min);
            if (max) params.append('maxPrice', max);
            if (cat) params.append('category', cat);
            if (web) params.append('websiteId', web);

            const res = await api.get(`/products?${params.toString()}`);
            const data = res.data;
            
            if (data.products) {
                setProducts(data.products || []);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotal(data.pagination?.total || 0);
            }
        } catch (err: any) {
            if (err.response?.status !== 401) {
                console.error('Failed to fetch products:', err);
                setError(err.response?.data?.error || 'Failed to fetch products');
            }
        } finally {
            setLoading(false);
        }
    }, [
        user,
        page, 
        initialLimit, 
        initialName, 
        initialMinPrice, 
        initialMaxPrice, 
        initialCategory, 
        initialWebsiteId
    ]);

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user, fetchProducts]);

    return {
        products,
        loading,
        page,
        setPage,
        totalPages,
        total,
        error,
        refresh: () => fetchProducts(),
    };
}
