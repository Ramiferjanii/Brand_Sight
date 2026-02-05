"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, CheckCircleIcon, ErrorIcon } from "@/icons";

const ScrapingMetrics: React.FC = () => {

  const [metrics, setMetrics] = React.useState({
    totalWebsites: 0,
    totalLinks: 0,
    totalImages: 0,
    recentScrapes: 0
  });

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/websites");
        const data = await res.json();
        const websites = data.websites || [];
        
        let links = 0;
        let images = 0;
        let recent = 0;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        websites.forEach((w: any) => {
            if (w.scrapedData) {
                links += w.scrapedData.linksCount || 0;
                images += w.scrapedData.imagesCount || 0;
            }
            if (w.lastScraped && new Date(w.lastScraped) > oneDayAgo) {
                recent++;
            }
        });

        setMetrics({
            totalWebsites: websites.length,
            totalLinks: links,
            totalImages: images,
            recentScrapes: recent
        });

      } catch (error) {
        console.error("Failed to fetch metrics", error);
      }
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Total Websites --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-500/10">
          <BoxIconLine className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Websites</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.totalWebsites}</h4>
          </div>
        </div>
      </div>

       {/* <!-- Metric Item Total Links --> */}
       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-500/10">
          <CheckCircleIcon className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Extracted Links</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.totalLinks.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      {/* <!-- Metric Item Total Images --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl dark:bg-purple-500/10">
           <svg className="text-purple-600 size-6 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Extracted Images</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.totalImages.toLocaleString()}</h4>
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
            <span className="text-sm text-gray-500 dark:text-gray-400">Recent Scrapes (24h)</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metrics.recentScrapes}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingMetrics;
