"use client";
import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const LandingHero: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-36 overflow-hidden bg-white dark:bg-gray-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full max-w-7xl overflow-visible pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-brand-500/20 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 blur-[140px] rounded-full" />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 dark:opacity-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50/80 dark:bg-brand-500/10 border border-brand-100/50 dark:border-brand-500/20 backdrop-blur-sm text-brand-600 dark:text-brand-400 text-xs font-bold mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500">
               <span className="absolute inline-flex h-2 w-2 rounded-full bg-brand-400 animate-ping opacity-75" />
            </span>
            New: Real-Time Competitor Analysis
          </motion.div>
          
          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]"
          >
            Master the Market with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-brand-400 to-purple-600">
              Intelligent Monitoring
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-3xl leading-relaxed font-medium"
          >
            Track price fluctuations, monitor sentiment trends, and benchmark competitors in real-time. 
            BrandSight turns web data into actionable market intelligence.
          </motion.p>
          
          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            {!isLoading && user ? (
              <Link href="/dashboard" className="w-full sm:w-auto group">
                <Button className="w-full sm:w-auto h-14 px-10 text-lg shadow-2xl shadow-brand-500/30 bg-brand-500 hover:bg-brand-600 rounded-2xl" endIcon={<ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />}>
                  Return to Dashboard
                </Button>
              </Link>
            ) : !isLoading ? (
              <Link href="/signup" className="w-full sm:w-auto group">
                <Button className="w-full sm:w-auto h-14 px-10 text-lg shadow-2xl shadow-brand-500/30 bg-brand-500 hover:bg-brand-600 rounded-2xl" endIcon={<ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />}>
                  Start Monitoring Now
                </Button>
              </Link>
            ) : null}
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                Explore Features
              </Button>
            </Link>
          </motion.div>
          
          {/* Main Visual / Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 relative w-full max-w-6xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-transparent h-64 bottom-0 z-10" />
            
            <div className="relative rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 p-3 backdrop-blur-sm shadow-[0_0_100px_rgba(59,130,246,0.15)] group transition-all duration-500 hover:shadow-[0_0_120px_rgba(59,130,246,0.25)]">
                <div className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-950 aspect-[16/10] relative shadow-inner">
                    <div className="absolute inset-0 bg-brand-500/5 dark:bg-brand-500/2" />
                    <video 
                        src="/images/video-thumb/v.mp4" 
                        className="object-cover w-full h-full opacity-90 dark:opacity-80"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    
                    {/* Decorative UI elements overlay */}
                    <div className="absolute top-4 left-4 p-3 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-xl hidden md:block animate-bounce-slow">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500" />
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Scraping</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-500/10 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;

