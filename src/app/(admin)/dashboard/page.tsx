"use client";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { ProductAnalysisCarousel } from "@/components/ecommerce/ProductAnalysisCarousel";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import AiDashboardInsights from "@/components/ecommerce/AiDashboardInsights";
import CategoryPriceChart from "@/components/ecommerce/CategoryPriceChart";
import ReviewsByDomainChart from "@/components/ecommerce/ReviewsByDomainChart";
import RatingHistogram from "@/components/ecommerce/RatingHistogram";
import { useDashboard } from "@/hooks/useDashboard";

export default function Ecommerce() {
  const { stats, insights, isLoadingStats, isLoadingInsights } = useDashboard();

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      <AiDashboardInsights insights={insights} isLoading={isLoadingInsights} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics stats={stats} isLoading={isLoadingStats} />
        </div>

        <div className="col-span-12">
          <ProductAnalysisCarousel />
        </div>

        {/* Global Statistical Section */}
        <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
           <CategoryPriceChart data={stats?.categoryPrices || []} />
           <ReviewsByDomainChart data={stats?.domainReviews || []} />
           <RatingHistogram data={stats?.ratingDistribution || []} />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <MonthlySalesChart distribution={stats?.domainDistribution || []} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget sentiment={stats?.sentimentBreakdown} />
        </div>
      </div>
    </div>
  );
}
