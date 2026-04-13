"use client";
import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ScrapingMetrics from "@/components/scraping/ScrapingMetrics";
import { CheckCircleIcon, ErrorIcon, BoxIconLine } from "@/icons";
import PageTour, { TourStep } from "@/components/tour/PageTour";

const healthTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "System Health 🩺",
    content: "Welcome to Scraping Health! This page gives you a deep dive into the status of your data pipelines.",
    data: { emoji: "🩺" },
  },
  {
    target: "[data-tour='health-metrics']",
    placement: "bottom",
    disableBeacon: true,
    title: "Global Metrics 📈",
    content: "View your current overall scraping success rate at a glance to ensure tasks are completing flawlessly.",
    data: { emoji: "📈" },
  },
  {
    target: "[data-tour='health-services']",
    placement: "right",
    disableBeacon: true,
    title: "Service Connectivity 🔌",
    content: "Monitor realtime API status for Rainforest API, Groq AI, and the Database to catch upstream outages.",
    data: { emoji: "🔌" },
  },
  {
    target: "[data-tour='health-logs']",
    placement: "left",
    disableBeacon: true,
    title: "Error Logs 🚨",
    content: "If a specific scraping task fails or an API times out, it will be logged here for debugging.",
    data: { emoji: "🚨" },
  },
];

export default function ScrapingHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageBreadCrumb pageTitle="Scraping Health & Diagnostics" />
        <PageTour steps={healthTourSteps} />
      </div>

      {/* Integrate the metrics card we just built at the top level */}
      <div data-tour="health-metrics">
        <ScrapingMetrics />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Services Status */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]" data-tour="health-services">
          <h3 className="mb-5 text-lg font-bold text-gray-800 dark:text-white/90">
            System Connectivity Status
          </h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg dark:bg-green-500/20">
                   <BoxIconLine className="text-green-600 size-5 dark:text-green-400" />
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800 dark:text-white/90">Rainforest API</p>
                   <p className="text-sm text-gray-500">Review Extraction Service</p>
                 </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircleIcon className="size-4" /> Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg dark:bg-green-500/20">
                   <BoxIconLine className="text-green-600 size-5 dark:text-green-400" />
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800 dark:text-white/90">Groq AI Inference</p>
                   <p className="text-sm text-gray-500">Llama3 Sentiment Analysis</p>
                 </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircleIcon className="size-4" /> Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg dark:bg-green-500/20">
                   <BoxIconLine className="text-green-600 size-5 dark:text-green-400" />
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800 dark:text-white/90">Main Database</p>
                   <p className="text-sm text-gray-500">PostgreSQL Cloud (Supabase)</p>
                 </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircleIcon className="size-4" /> Operational
              </span>
            </div>

          </div>
        </div>

        {/* Recent Error Logs Placeholder */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]" data-tour="health-logs">
          <h3 className="mb-5 text-lg font-bold text-gray-800 dark:text-white/90">
            Recent Alerts & Error Logs
          </h3>
          
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-xl dark:border-gray-800">
            <div className="flex items-center justify-center w-14 h-14 bg-green-50 rounded-full dark:bg-green-500/10 mb-4">
              <CheckCircleIcon className="text-green-600 size-7 dark:text-green-400" />
            </div>
            <h4 className="text-gray-800 dark:text-white/90 font-semibold mb-1">No Recent Errors</h4>
            <p className="text-sm text-gray-500 max-w-[250px]">
              Your scraping pipelines are running smoothly. Any target failures or API timeouts will appear here.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
