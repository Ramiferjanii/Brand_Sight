"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, CheckCircleIcon, ErrorIcon } from "@/icons";

const ScrapingMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Success --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-500/10">
          <CheckCircleIcon className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Scraped</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">24,532</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> 12%
          </Badge>
        </div>
      </div>

      {/* <!-- Metric Item Active --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-500/10">
          <BoxIconLine className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Active Tasks</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">3</h4>
          </div>
        </div>
      </div>

      {/* <!-- Metric Item Errors --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl dark:bg-red-500/10">
          <ErrorIcon className="text-red-600 size-6 dark:text-red-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Failed Tasks</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">12</h4>
          </div>
          <Badge color="error">
             8%
          </Badge>
        </div>
      </div>

       {/* <!-- Metric Item Proxies --> */}
       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl dark:bg-purple-500/10">
          <svg className="text-purple-600 size-6 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Proxies Active</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">42</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingMetrics;
