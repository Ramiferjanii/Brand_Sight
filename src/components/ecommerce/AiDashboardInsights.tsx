"use client";
import React from "react";
import { ShootingStarIcon, ArrowUpIcon, BoltIcon } from "@/icons";

interface AiInsightsProps {
  insights: {
    summary: string;
    topInsight: string;
    tips: string[];
  } | null;
  isLoading: boolean;
}

export default function AiDashboardInsights({ insights, isLoading }: AiInsightsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 dark:border-blue-900/30 dark:from-blue-900/10 dark:to-indigo-900/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ShootingStarIcon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI-Powered Market Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {insights.summary}
          </p>
          
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
            <ArrowUpIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm uppercase tracking-wider mb-1">Top Insight</h4>
              <p className="text-gray-800 dark:text-gray-200">{insights.topInsight}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 border-l border-gray-200/50 dark:border-gray-700/50 pl-0 md:pl-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <BoltIcon className="h-4 w-4" />
            Growth Tips
          </div>
          <ul className="space-y-3">
            {insights.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-bold leading-none">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
