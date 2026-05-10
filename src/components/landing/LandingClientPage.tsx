"use client";
import React from "react";
import { motion } from "framer-motion";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingCTAAuthButtons from "@/components/landing/LandingCTAAuthButtons";
import DashboardPreview from "@/components/landing/DashboardPreview";

const LandingClientPage = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      <LandingHero />
      
      <LandingFeatures />

      {/* Product Showcase Section */}
      <section className="py-24 lg:py-40 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="flex-1 w-full order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
                Brand Performance <br />
                <span className="text-brand-500 italic">at a Glance.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                BrandSight turns raw web data into beautiful, interactive visualizations. 
                Monitor sentiment trends, track keyword mentions, and understand your market positioning without manual effort.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: "AI Analysis", desc: "Automated sentiment scoring" },
                  { title: "Deep Specs", desc: "Detailed technical extraction" },
                  { title: "Live Tracking", desc: "Periodic inventory polling" },
                  { title: "Exportable", desc: "Clean CSV & PDF reporting" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="flex-1 w-full relative order-1 lg:order-2"
            >
              <div className="relative group">
                 {/* Decorative card underneath */}
                 <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand-500/10 to-purple-500/10 blur-2xl group-hover:opacity-100 transition-opacity" />
                 <DashboardPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LandingTestimonials />

      {/* Final CTA Section */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="max-w-6xl mx-auto rounded-[3.5rem] bg-brand-500 p-12 lg:p-24 relative overflow-hidden shadow-[0_20px_100px_rgba(59,130,246,0.4)]"
          >
            {/* Background glowing shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                Ready to own your <br /> market data?
              </h2>
              <p className="text-brand-50 text-xl md:text-2xl mb-12 opacity-90 font-medium">
                Join the fastest growing brands using BrandSight to power their business intelligence. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <LandingCTAAuthButtons />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingClientPage;
