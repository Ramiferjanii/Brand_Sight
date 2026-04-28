'use client';
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import api from '@/lib/api';
import PageTour, { TourStep } from '@/components/tour/PageTour';
import { useAuth } from '@/context/AuthContext';

const productsTourSteps: TourStep[] = [
  {
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    title: 'Products Catalog 🛍️',
    content: "Browse all products collected by the scraper. Use filters to narrow down by name, price range or category.",
    data: { emoji: '🛍️' },
  },
  {
    target: "[data-tour='products-filters']",
    placement: 'right',
    disableBeacon: true,
    title: 'Filter Panel 🔍',
    content: 'Search by keyword, set a price range, or select a category. Hit Apply Filters to update the grid.',
    data: { emoji: '🔍' },
  },
  {
    target: "[data-tour='products-grid']",
    placement: 'left',
    disableBeacon: true,
    title: 'Product Grid 🗂️',
    content: 'Matching products appear here. Click any card to see full details, reviews and AI analysis.',
    data: { emoji: '🗂️' },
  },
];


export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');

    const fetchProducts = async (overrides?: { page?: number; search?: string; minPrice?: string; maxPrice?: string; category?: string }) => {
        if (!user) return;
        setLoading(true);
        try {
            const p = overrides?.page ?? page;
            const s = overrides?.search ?? search;
            const min = overrides?.minPrice ?? minPrice;
            const max = overrides?.maxPrice ?? maxPrice;
            const cat = overrides?.category ?? category;

            const params = new URLSearchParams();
            params.append('page', p.toString());
            params.append('limit', '12');
            if (s) params.append('name', s);
            if (min) params.append('minPrice', min);
            if (max) params.append('maxPrice', max);
            if (cat) params.append('category', cat);

            const res = await api.get(`/products?${params.toString()}`);
            const data = res.data;
            
            if (data.products) {
                setProducts(data.products);
                setTotalPages(data.pagination?.totalPages || 1);
            }
        } catch (error: any) {
            if (error.response?.status !== 401) {
                console.error('Failed to fetch products:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProducts({ page });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, user]); // Trigger on page change or user login

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        // Pass current filter values directly — avoids stale state reads after setPage(1)
        fetchProducts({ page: 1, search, minPrice, maxPrice, category });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <PageTour steps={productsTourSteps} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1" data-tour="products-filters">
                    <ComponentCard title="Filters" className="sticky top-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Search
                                </label>
                                <Input 
                                    type="text" 
                                    placeholder="Name or keyword..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Min Price
                                    </label>
                                    <Input 
                                        type="number" 
                                        placeholder="0" 
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Max Price
                                    </label>
                                    <Input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Computers">Computers</option>
                                    <option value="Phones">Phones</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full justify-center">
                                Apply Filters
                            </Button>
                        </form>
                    </ComponentCard>
                </div>

                {/* Product Grid */}
                <div className="lg:col-span-3" data-tour="products-grid">
                    {loading ? (
                       <div className="flex h-64 items-center justify-center">
                           <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
                       </div>
                    ) : products.length === 0 ? (
                        <EmptyState 
                            title={search || minPrice || maxPrice || category ? "No products found" : "Your catalog is empty"}
                            description={search || minPrice || maxPrice || category 
                                ? "We couldn't find any products matching your current filters. Try adjusting your price range or search terms." 
                                : "You haven't scraped any products yet. Head over to the scraping section to start building your catalog."}
                            actionLabel={search || minPrice || maxPrice || category ? "Reset All Filters" : "Go to Scraper"}
                            href={search || minPrice || maxPrice || category ? undefined : "/scraping"}
                            onReset={search || minPrice || maxPrice || category ? () => {
                                setSearch('');
                                setMinPrice('');
                                setMaxPrice('');
                                setCategory('');
                                setPage(1);
                                fetchProducts({ page: 1, search: '', minPrice: '', maxPrice: '', category: '' });
                            } : undefined}
                            icon={!(search || minPrice || maxPrice || category) ? (
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : undefined}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
                            >
                                Previous
                            </button>
                            <span className="flex items-center px-2 text-sm text-gray-600 dark:text-gray-400">
                                Page {page} of {totalPages}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
