"use client";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Driven Insights",
    description: "Llama-3 powered analysis of market trends and sentiment to give you the competitive edge.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "bg-brand-500"
  },
  {
    title: "Real-Time Monitoring",
    description: "Track price changes and stock availability across multiple retailers as they happen.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-purple-500"
  },
  {
    title: "Competitor Battle",
    description: "Side-by-side technical comparison of products with detailed spec extraction and AI verdicts.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "bg-blue-500"
  }
];

const LandingFeatures: React.FC = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-purple-500/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-brand-500 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-4 block"
          >
            Core Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
          >
            Data Intelligence for <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-brand-400">Winning Strategies</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Powerful tools designed to help you extract, analyze, and act on web data with unprecedented speed and accuracy.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative p-10 rounded-[3rem] bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-[1.25rem] ${feature.color} flex items-center justify-center text-white mb-8 shadow-2xl shadow-current/30 group-hover:rotate-6 transition-transform duration-500`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-lg">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-brand-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                 Learn more
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
