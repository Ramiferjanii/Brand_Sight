import React from "react";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BrandSight | The Ultimate Web Scraping Platform",
  description: "Scale your data collection with the most advanced web scraping dashboard. Integrated with Puppeteer, Playwright, and intelligent proxy rotation.",
};

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingTestimonials />
      
      {/* Additional Content Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Brand Performance <br />
                <span className="text-brand-500">at a Glance</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                BrandSight helps companies monitor their brand performance in real-time using open source data. 
                Visualize sentiment trends, keyword mentions, and engagement metrics to understand your public image.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Real-time text data collection",
                  "Sentiment & keyword analysis pipeline",
                  "Interactive data visualization",
                  "Performance optimization & caching"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-brand-500/20 blur-[100px] -z-10" />
                <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-10 shadow-xl">
                   <div className="space-y-6">
                      <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-800 rounded-full" />
                      <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
                      <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-full" />
                      <div className="pt-4 grid grid-cols-2 gap-4">
                        <div className="h-24 bg-brand-50 dark:bg-brand-500/10 rounded-2xl border border-brand-100 dark:border-brand-500/20" />
                        <div className="h-24 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-100 dark:border-purple-500/20" />
                      </div>
                      <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto rounded-[2rem] bg-brand-950 p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to understand your brand's impact?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Join teams using BrandSight to power their business intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button className="h-12 px-8 rounded-lg bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25">
                   Get Started for Free
                 </button>
                 <button className="h-12 px-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/10">
                   Schedule a Demo
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
