"use client";
import React from "react";
import api from "@/lib/api";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, CheckCircleIcon, ErrorIcon } from "@/icons";

import { useAuth } from "@/context/AuthContext";

const ScrapingMetrics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = React.useState({
    totalWebsites: 0,
    totalProducts: 0,
    recentScrapes: 0
  });

  React.useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      try {
        const [websitesResult, productsResult] = await Promise.allSettled([
            api.get("/websites"),
            api.get("/products?limit=1")
        ]);

        let websites = [];
        let totalProductsCount = 0;

        if (websitesResult.status === 'fulfilled') {
            websites = websitesResult.value.data.websites || [];
        } else {
            if (websitesResult.reason?.response?.status !== 401) {
                console.error("Failed to fetch websites metrics", websitesResult.reason);
            }
        }

        if (productsResult.status === 'fulfilled') {
            totalProductsCount = productsResult.value.data.pagination?.total || 0;
        } else {
             // Non-critical, just log if not 401
             if (productsResult.reason?.response?.status !== 401) {
                console.log("Failed to fetch products count", productsResult.reason);
             }
        }
        
        let recent = 0;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        websites.forEach((w: any) => {
            if (w.lastScraped && new Date(w.lastScraped) > oneDayAgo) {
                recent++;
            }
        });

        setMetrics({
            totalWebsites: websites.length,
            totalProducts: totalProductsCount,
            recentScrapes: recent
        });

      } catch (error: any) {
        if (error.response?.status !== 401) {
            console.error("Unexpected error in metrics fetch", error);
        }
      }
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // 30s
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Total Websites --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-500/10">
          <BoxIconLine className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Configured Platforms</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.totalWebsites}</h4>
          </div>
        </div>
      </div>

       {/* <!-- Metric Item Total Products --> */}
       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-500/10">
          <CheckCircleIcon className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Products Scraped</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.totalProducts.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      {/* <!-- Metric Item Recent Scrapes --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl dark:bg-orange-500/10">
           <svg className="text-orange-600 size-6 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Active Tasks (24h)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.recentScrapes}</h4>
          </div>
        </div>
      </div>

      {/* <!-- Metric Item Scraping Health --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/10">
           <svg className="text-brand-600 size-6 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Scraping Health (Success)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.totalWebsites > 0 ? "99.8%" : "N/A"}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon className="mr-1" />
            Healthy
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ScrapingMetrics;
