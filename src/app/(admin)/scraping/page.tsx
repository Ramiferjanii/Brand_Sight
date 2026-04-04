"use client";
import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ScrapingForm from "@/components/scraping/ScrapingForm";
import ScrapingResults from "@/components/scraping/ScrapingResults";
import ScrapingMetrics from "@/components/scraping/ScrapingMetrics";
import PageTour, { TourStep } from "@/components/tour/PageTour";

const scrapingTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "Web Scraper 🕷️",
    content: "This is where you configure and launch scraping tasks. Let's walk through the key sections.",
    data: { emoji: "🕷️" },
  },
  {
    target: "[data-tour='scraping-metrics']",
    placement: "bottom",
    disableBeacon: true,
    title: "Scraping Metrics 📊",
    content: "At a glance stats: total tasks run, products collected, success rate and active sessions.",
    data: { emoji: "📊" },
  },
  {
    target: "[data-tour='scraping-form']",
    placement: "right",
    disableBeacon: true,
    title: "Configure a New Task ⚙️",
    content: "Enter the target URL and settings here, then hit 'Start Scraping'. The engine will extract product data automatically.",
    data: { emoji: "⚙️" },
  },
  {
    target: "[data-tour='scraping-live']",
    placement: "left",
    disableBeacon: true,
    title: "Live Results Feed 🔴",
    content: "Scraped products appear here in real-time as the scraper runs. You can inspect each item immediately.",
    data: { emoji: "🔴" },
  },
];

export default function ScrapingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageBreadCrumb pageTitle="Web Scraper" />
        <PageTour steps={scrapingTourSteps} />
      </div>

      <div data-tour="scraping-metrics">
        <ScrapingMetrics />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4" data-tour="scraping-form">
          <ScrapingForm />
        </div>

        <div className="xl:col-span-8" data-tour="scraping-live">
          <ScrapingResults />
        </div>
      </div>
    </div>
  );
}
