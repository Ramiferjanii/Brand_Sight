"use client";
import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons";

const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-brand-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-purple-500/5 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
            New: Playwright Support Added
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Scrape the Web with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple-600">
              Umatched Precision
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
            The ultimate web scraping dashboard for developers and businesses. 
            Automate data extraction, bypass blocks, and scale your operations effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup">
              <Button className="h-12 px-8 text-base shadow-lg shadow-brand-500/20" endIcon={<ArrowRightIcon />}>
                Start Scraping Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="h-12 px-8 text-base border-gray-200 dark:border-gray-800">
                View Features
              </Button>
            </Link>
          </div>
          
          {/* Mockup Preview */}
          <div className="mt-16 relative w-full max-w-5xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent h-40 bottom-0 z-10" />
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-950 aspect-[16/9] relative">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bbbda5366fd9?auto=format&fit=crop&q=80&w=2070" 
                        alt="Dashboard Preview" 
                        className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20">
                         {/* Play Button Icon for video feel */}
                         <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                            <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                         </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
