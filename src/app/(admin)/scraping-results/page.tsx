"use client";
import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ScrapingHistory from "@/components/scraping/ScrapingHistory";
import PageTour, { TourStep } from "@/components/tour/PageTour";

const resultsTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "Scraping Results 📂",
    content: "Here you can view and manage all past and present scraping sessions. Let's explore what's available.",
    data: { emoji: "📂" },
  },
  {
    target: "[data-tour='results-history']",
    placement: "top",
    disableBeacon: true,
    title: "Scraping History Table 📋",
    content: "Every scraping run is logged here with its status, URL, products found and timestamp. You can re-run or delete sessions.",
    data: { emoji: "📋" },
  },
];

export default function ScrapingResultsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageBreadCrumb pageTitle="Scraping Results" />
        <PageTour steps={resultsTourSteps} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1" data-tour="results-history">
          <ScrapingHistory />
        </div>
      </div>
    </div>
  );
}

