import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | BrandSight",
  description: "Learn more about the team behind BrandSight, building the ultimate real-time brand monitoring platform.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            About <span className="text-brand-500">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            We're on a mission to democratize brand monitoring. BrandSight is built to help modern businesses track sentiment and analyze product feedback at scale.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 relative z-10 leading-relaxed">
              In a world where public perception changes in an instant, we believe businesses shouldn't have to rely on expensive, gated enterprise tools to understand their own customers. Our mission is to make powerful web scraping and real-time AI sentiment analysis accessible to everyone.
            </p>
          </div>
          
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 relative z-10 leading-relaxed">
              We envision a future where business intelligence runs on autopilot. Through intelligent scraping nodes, automated sentiment tracking, and comprehensive market reports, BrandSight aims to be the central nervous system for your brand's digital presence.
            </p>
          </div>
        </div>

        {/* Our Story / Technical Approach */}
        <div className="max-w-4xl mx-auto text-center border-t border-gray-100 dark:border-gray-800 pt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Crafted with Modern Tech</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
            BrandSight was born out of the frustration of dealing with brittle web scrapers and messy data pipelines. 
            We rebuilt the scraping experience from the ground up using a cutting-edge stack:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Next.js 14", sub: "Frontend" },
              { label: "PostgreSQL", sub: "Database" },
              { label: "Groq Llama 3", sub: "AI Inference" },
              { label: "Node.js", sub: "Scraping Engine" }
            ].map((tech, i) => (
              <div key={i} className="p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="font-bold text-gray-900 dark:text-white mb-1">{tech.label}</div>
                <div className="text-sm text-gray-500">{tech.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
