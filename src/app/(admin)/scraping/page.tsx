import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ScrapingForm from "@/components/scraping/ScrapingForm";
import ScrapingResults from "@/components/scraping/ScrapingResults";
import { Metadata } from "next";

import ScrapingMetrics from "@/components/scraping/ScrapingMetrics";

export const metadata: Metadata = {
  title: "Web Scraper | Dashboard",
  description: "Configure and run web scraping tasks.",
};

export default function ScrapingPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageTitle="Web Scraper" />
      
      <ScrapingMetrics />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <ScrapingForm />
        </div>
        
        <div className="xl:col-span-8">
          <ScrapingResults />
        </div>
      </div>
    </div>
  );
}
