"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { useProducts } from "@/hooks/useProducts";
import { useReviews } from "@/hooks/useReviews";
import { Product } from "@/types/product";
import Image from "next/image";
import ComponentCard from "../common/ComponentCard";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ShootingStarIcon } from "@/icons";

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const StarIconFill = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const ProductAnalysisCarousel = () => {
  const productsOptions = React.useMemo(() => ({ limit: 12 }), []);
  const { products, loading: loadingProducts } = useProducts(productsOptions);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  const {
    reviews,
    summary,
    aiVerdict,
    trends,
    isLoadingReviews,
    isLoadingSummary,
    isLoadingAi,
    isLoadingTrends,
    isFetching,
    fetchReviews,
    fetchSummary,
    fetchAiVerdict,
    fetchTrends,
    triggerFetch
  } = useReviews(selectedProduct?.id || "");

  useEffect(() => {
    if (selectedProduct?.id) {
      fetchSummary();
      fetchReviews(1);
      fetchAiVerdict();
      fetchTrends();
    }
  }, [selectedProduct, fetchSummary, fetchReviews, fetchAiVerdict, fetchTrends]);

  const sentimentChartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: ["Positive", "Neutral", "Negative"],
    colors: ["#22c55e", "#94a3b8", "#ef4444"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const sentimentChartSeries = [
    summary?.positive || 0,
    summary?.neutral || 0,
    summary?.negative || 0,
  ];

  const salesActivityChartOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#465FFF"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100],
      },
    },
    xaxis: {
      categories: trends.map(t => t.year),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
  };

  const salesActivitySeries = [
    {
      name: "Estimated Sales",
      data: trends.map(t => t.count * 85), // Estimated 85 sales per review
    },
  ];

  if (loadingProducts) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-2xl dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="space-y-6">
      {/* Product Carousel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Select Product to Analyze
        </h3>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          navigation={true}
          className="product-swiper !pb-16 pt-4"
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="p-2">
              <div
                onClick={() => setSelectedProduct(product)}
                className={`cursor-pointer rounded-xl border-2 transition-all p-4 mb-6 ${
                  selectedProduct?.id === product.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-gray-100 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={product.image || "/images/product/placeholder.png"}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                </div>
                <h5 className="line-clamp-2 text-sm font-bold text-gray-800 dark:text-white/90">
                  {product.name}
                </h5>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-500">
                    {product.price || "N/A"}
                  </span>
                  <span className="text-xs text-gray-400">{product.domain}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedProduct && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Analysis Charts */}
          <ComponentCard title={`Analysis: ${selectedProduct.name}`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center">
                <span className="mb-4 text-sm font-medium text-gray-500">Sentiment Distribution</span>
                {isLoadingSummary ? (
                   <div className="h-[200px] w-full animate-pulse bg-gray-100 rounded-lg"></div>
                ) : (
                  <Chart
                    options={sentimentChartOptions}
                    series={sentimentChartSeries}
                    type="donut"
                    width={280}
                  />
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="mb-4 text-sm font-medium text-gray-500">Estimated Sales (Volume)</span>
                {isLoadingTrends ? (
                  <div className="h-[200px] w-full animate-pulse bg-gray-100 rounded-lg"></div>
                ) : (
                  <Chart
                    options={salesActivityChartOptions}
                    series={salesActivitySeries}
                    type="area"
                    width={280}
                    height={200}
                  />
                )}
              </div>
            </div>

            {/* AI Verdict Summary if available */}
            {aiVerdict && aiVerdict.hasData && (
               <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 dark:text-white">AI Product Verdict</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {aiVerdict.verdict}
                  </p>
               </div>
            )}
          </ComponentCard>

          {/* Recent Reviews */}
          <ComponentCard title="Recent Reviews">
            {isLoadingReviews || isFetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-50 dark:bg-gray-800"></div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          i < (review.rating || 0) ? <StarIconFill key={i} className="size-3" /> : <StarIcon key={i} className="size-3" />
                        ))}
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        review.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                        review.sentiment === 'negative' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {review.sentiment}
                      </span>
                    </div>
                    <h6 className="text-sm font-bold text-gray-800 dark:text-white/90 mb-1">{review.title ?? "Review"}</h6>
                    <p className="text-xs text-gray-500 line-clamp-2">{review.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <p className="text-gray-400 text-sm mb-4">No reviews found for this product.</p>
                <button
                  onClick={() => triggerFetch(20)}
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  Fetch Reviews from Amazon
                </button>
              </div>
            )}
          </ComponentCard>
        </div>
      )}
    </div>
  );
};
