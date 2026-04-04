"use client";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { ProductAnalysisCarousel } from "@/components/ecommerce/ProductAnalysisCarousel";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import AiDashboardInsights from "@/components/ecommerce/AiDashboardInsights";
import CategoryPriceChart from "@/components/ecommerce/CategoryPriceChart";
import RatingHistogram from "@/components/ecommerce/RatingHistogram";
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
  },
  {
    target: "[data-tour='dashboard-charts']",
    placement: "top",
    disableBeacon: true,
    title: "Category & Rating Charts 🥧",
    content: "Visualize average price per category and the rating distribution across all scraped products.",
    data: { emoji: "🥧" },
  },
  {
    target: "[data-tour='dashboard-sales']",
    placement: "top",
    disableBeacon: true,
    title: "Monthly Sales Trend 📅",
    content: "Track estimated sales volume over time based on review activity trends.",
    data: { emoji: "📅" },
  },
  {
    target: "[data-tour='dashboard-target']",
    placement: "left",
    disableBeacon: true,
    title: "Sentiment & Target 🎯",
    content: "See the overall sentiment breakdown (positive vs negative) and trigger a data recalculation here.",
    data: { emoji: "🎯" },
  },
];

export default function Ecommerce() {
  const { stats, insights, salesVolume, isLoadingSalesVolume, fetchSalesVolume, isLoadingStats, isLoadingInsights, refresh } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Page header with tour button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Dashboard</h1>
        <PageTour steps={dashboardTourSteps} />
      </div>

      {/* AI Insights Section */}
      <div data-tour="ai-insights">
        <AiDashboardInsights insights={insights} isLoading={isLoadingInsights} />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12" data-tour="dashboard-metrics">
          <EcommerceMetrics stats={stats} isLoading={isLoadingStats} />
        </div>

        <div className="col-span-12" data-tour="dashboard-carousel">
          <ProductAnalysisCarousel />
        </div>

        {/* Global Statistical Section */}
        <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2" data-tour="dashboard-charts">
           <CategoryPriceChart data={stats?.categoryPrices || []} />
           <RatingHistogram data={stats?.ratingDistribution || []} />
        </div>

        <div className="col-span-12 xl:col-span-7" data-tour="dashboard-sales">
          <MonthlySalesChart 
            salesVolume={salesVolume}
            isLoading={isLoadingSalesVolume}
            fetchSalesVolume={fetchSalesVolume}
            fallbackData={stats?.monthlySales || []} 
          />
        </div>

        <div className="col-span-12 xl:col-span-5" data-tour="dashboard-target">
          <MonthlyTarget sentiment={stats?.sentimentBreakdown} onRefresh={refresh} />
        </div>
      </div>
    </div>
  );
}
