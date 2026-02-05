"use client";
import React from "react";
import { BoltIcon, BoxIcon, PieChartIcon } from "@/icons";

const features = [
  {
    title: "Real-Time Monitoring",
    description: "Collect and clean textual data from open sources in real-time to stay ahead of the curve.",
    icon: <BoltIcon className="w-6 h-6 text-brand-500" />
  },
  {
    title: "Sentiment Analysis",
    description: "Advanced NLP pipeline using Spacy to analyze sentiment and track specific keywords automatically.",
    icon: <BoxIcon className="w-6 h-6 text-purple-500" />
  },
  {
    title: "Interactive Dashboards",
    description: "Visualize trends, keyword mentions, and engagement metrics with real-time updates.",
    icon: <PieChartIcon className="w-6 h-6 text-blue-500" />
  }
];

const LandingFeatures: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-white/[0.02]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Platform for Brands in Real Time
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A web platform that helps companies monitor their brand performance in real-time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
