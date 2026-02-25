import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ScrapingHistory from "@/components/scraping/ScrapingHistory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Scraper | Results History",
  description: "View results, history and download data for all your scraping tasks.",
};

export default function ScrapingResultsPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageTitle="Scraping Results" />
      
      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <ScrapingHistory />
        </div>
      </div>
    </div>
  );
}
