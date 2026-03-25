'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import Link from 'next/link';
import { ProductReviewsModal } from './ProductReviewsModal';
import api from '@/lib/api';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [showReviews, setShowReviews] = useState(false);
    
    // Deal Analysis State
    const [dealStatus, setDealStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [dealData, setDealData] = useState<{ rating: string; explanation: string } | null>(null);

    const handleAnalyzeDeal = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (dealStatus === 'success') {
            setDealStatus('idle'); // Toggle collapse
            return;
        }

        try {
            setDealStatus('loading');
            const res = await api.get(`/products/${product.id}/deal-analysis`);
            setDealData(res.data.analysis);
            setDealStatus('success');
        } catch (error) {
            console.error(error);
            setDealStatus('error');
            setTimeout(() => setDealStatus('idle'), 3000); // reset after error
        }
    };

    return (
        <>
            <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                {/* Product Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {/* Domain Badge */}
                    <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:bg-black/50 dark:text-gray-200">
                        {product.domain}
                    </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white" title={product.name}>
                                <Link
                                    href={product.url}
                                    target="_blank"
                                    className="hover:text-brand-500 transition-colors relative z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {product.name}
                                </Link>
                            </h3>
                        </div>
                    </div>

                    <p className="mb-4 flex-1 text-xs text-gray-500 line-clamp-3 dark:text-gray-400">
                        {product.overview !== 'Not found' ? product.overview : 'No description available.'}
                    </p>

                    <div className="mt-auto space-y-3">
                        <div className="flex items-end justify-between border-t border-gray-100 pt-3 dark:border-gray-800 transition-colors">
                            <div>
                                <p className="text-xs text-gray-400">Reference</p>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {product.reference && product.reference !== 'Not found' && product.reference !== ''
                                        ? product.reference
                                        : 'N/A'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                    {product.price !== 'Not found' ? product.price : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Deal Analysis Section */}
                        <div className="relative z-20">
                            {dealStatus === 'success' && dealData ? (
                                <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-900/20">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                                                {dealData.rating === 'Good Deal' ? '🔥 Good Deal' : dealData.rating === 'Overpriced' ? '⚠️ Overpriced' : '⚖️ Normal Price'}
                                            </span>
                                        </div>
                                        <button onClick={handleAnalyzeDeal} className="text-xs text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline">
                                            Hide
                                        </button>
                                    </div>
                                    <p className="text-xs text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed italic">
                                        "{dealData.explanation}"
                                    </p>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={handleAnalyzeDeal}
                                    disabled={dealStatus === 'loading'}
                                    className={`flex w-full items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-xs font-semibold transition-all ${
                                        dealStatus === 'error' ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400' 
                                        : 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/40'
                                    }`}
                                >
                                    {dealStatus === 'loading' ? (
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                                    ) : dealStatus === 'error' ? (
                                        '✗ Error'
                                    ) : (
                                        '✨ Deal'
                                    )}
                                </button>

                                {/* Ask AI Button – fires global chatbot event */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.dispatchEvent(new CustomEvent('open-chat-with-product', {
                                            detail: {
                                                productName: product.name,
                                                productPrice: product.price,
                                                productDomain: product.domain,
                                            }
                                        }));
                                    }}
                                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-1.5 py-2 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                                    title="Ask AI about this product"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Ask AI
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowReviews(true);
                                    }}
                                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-1.5 py-2 text-xs font-semibold text-brand-600 transition-all hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-900/40"
                                >
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.951 2.878c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                                    </svg>
                                    Reviews
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full-card link (behind the button via z-index) */}
                <Link
                    href={product.url}
                    target="_blank"
                    className="absolute inset-0 z-10"
                    aria-label={`View ${product.name}`}
                />
            </div>

            {/* Reviews Modal */}
            {showReviews && (
                <ProductReviewsModal
                    productId={product.id}
                    productName={product.name}
                    onClose={() => setShowReviews(false)}
                />
            )}
        </>
    );
};
