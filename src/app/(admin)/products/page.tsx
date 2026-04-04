'use client';
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import api from '@/lib/api';
import PageTour, { TourStep } from '@/components/tour/PageTour';

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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '12');
            if (search) params.append('name', search);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            if (category) params.append('category', category);

            const res = await api.get(`/products?${params.toString()}`);
            const data = res.data;
            
            if (data.products) {
                setProducts(data.products);
                setTotalPages(data.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]); // Trigger on page change

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to page 1 on search
        fetchProducts();
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

                            <Button className="w-full justify-center">
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
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or scrape some websites.</p>
                        </div>
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
