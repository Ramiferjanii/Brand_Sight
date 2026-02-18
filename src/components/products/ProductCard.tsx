import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
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
                       {/* Placeholder Icon */}
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
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white" title={product.name}>
                            <Link href={product.url} target="_blank" className="hover:text-brand-500 transition-colors">
                            {product.name}
                            </Link>
                        </h3>
                    </div>
                </div>

                <p className="mb-4 flex-1 text-xs text-gray-500 line-clamp-3 dark:text-gray-400">
                    {product.overview !== 'Not found' ? product.overview : 'No description available.'}
                </p>
                
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3 dark:border-gray-800 transition-colors">
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
            </div>
            
             <Link href={product.url} target="_blank" className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
        </div>
    );
};
