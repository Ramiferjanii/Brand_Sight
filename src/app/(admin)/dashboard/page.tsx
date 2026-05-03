"use client";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { ProductAnalysisCarousel } from "@/components/ecommerce/ProductAnalysisCarousel";
import React from "react";
import MonthlyReviewChart from "@/components/ecommerce/MonthlyReviewChart";
import RatingVsPriceChart from "@/components/ecommerce/RatingVsPriceChart";
import AiDashboardInsights from "@/components/ecommerce/AiDashboardInsights";
import { useDashboard } from "@/hooks/useDashboard";
import PageTour, { TourStep } from "@/components/tour/PageTour";

const dashboardTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "Dashboard Overview 📊",
    content: "This is your main analytics hub. Let's walk through the key sections so you know where everything lives.",
    data: { emoji: "📊" },
  },
  {
    target: "[data-tour='ai-insights']",
    placement: "bottom",
    disableBeacon: true,
    title: "AI-Powered Insights 🤖",
    content: "Your personal AI analyst reviews all scraped data and surfaces actionable insights automatically. No manual analysis needed.",
    data: { emoji: "🤖" },
  },
  {
    target: "[data-tour='dashboard-metrics']",
    placement: "bottom",
    disableBeacon: true,
    title: "Live Metrics 📈",
    content: "Real-time totals: active scrapes, products tracked, reviews collected, and average market price — all updated live.",
    data: { emoji: "📈" },
  },
  {
    target: "[data-tour='dashboard-carousel']",
    placement: "top",
    disableBeacon: true,
    title: "Product Analysis Carousel",
    content: "Browse individual product cards and their AI verdicts, deal scores and review breakdowns here.",
    data: { emoji: "🎠" },
  }
];

export default function Ecommerce() {
  const { stats, insights, reviewActivity, scatterData, isLoadingReviewActivity, isLoadingStats, isLoadingInsights, isLoadingScatter, fetchReviewActivity, refresh } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Page header with tour button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Dashboard</h1>
        <PageTour steps={dashboardTourSteps} />
      </div>

      {/* AI Insights Section */}
      <div data-tour="ai-insights" className="scroll-mt-28">
        <AiDashboardInsights insights={insights} isLoading={isLoadingInsights} />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 scroll-mt-28" data-tour="dashboard-metrics">
          <EcommerceMetrics stats={stats} isLoading={isLoadingStats} />
        </div>

        <div className="col-span-12 scroll-mt-28" data-tour="dashboard-carousel">
          <ProductAnalysisCarousel />
        </div>

        <div className="col-span-12 xl:col-span-6" data-tour="dashboard-sales">
          <MonthlyReviewChart
            reviewActivity={reviewActivity}
            isLoading={isLoadingReviewActivity}
            fetchReviewActivity={fetchReviewActivity}
          />
        </div>

        <div className="col-span-12 xl:col-span-6" data-tour="dashboard-scatter">
          <RatingVsPriceChart 
            data={scatterData} 
            isLoading={isLoadingScatter} 
          />
        </div>
      </div>
    </div>
  );
}
