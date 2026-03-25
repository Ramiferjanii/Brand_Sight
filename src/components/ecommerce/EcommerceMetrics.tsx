"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, GroupIcon, ShootingStarIcon, PieChartIcon } from "@/icons";

interface MetricsProps {
  stats: {
    websiteCount: number;
    productCount: number;
    reviewCount: number;
    avgRating: number;
  } | null;
  isLoading: boolean;
}

export const EcommerceMetrics = ({ stats, isLoading }: MetricsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* <!-- Metric Items --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-900/10">
          <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Websites</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats?.websiteCount || 0}</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl dark:bg-emerald-900/10">
          <BoxIconLine className="text-emerald-600 size-6 dark:text-emerald-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats?.productCount || 0}</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl dark:bg-amber-900/10">
          <PieChartIcon className="text-amber-600 size-6 dark:text-amber-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Reviews Analyzed</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats?.reviewCount || 0}</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-rose-50 rounded-xl dark:bg-rose-900/10">
          <ShootingStarIcon className="text-rose-600 size-6 dark:text-rose-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Market Rating</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{(stats?.avgRating || 0).toFixed(1)}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {((stats?.avgRating || 0) * 20).toFixed(0)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};
