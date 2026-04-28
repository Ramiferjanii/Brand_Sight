"use client";
import React from "react";
import { GridIcon, BoxIcon, DollarLineIcon, ShootingStarIcon } from "@/icons";

const DashboardPreview: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-4 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative background for the card itself */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[80px] -z-10" />
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Websites", value: "1", icon: <GridIcon className="w-6 h-6 text-blue-500" />, color: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Total Products", value: "59", icon: <BoxIcon className="w-6 h-6 text-green-500" />, color: "bg-green-50 dark:bg-green-500/10" },
          { label: "Estimated Market Sales", value: "7735", icon: <DollarLineIcon className="w-6 h-6 text-orange-500" />, color: "bg-orange-50 dark:bg-orange-500/10" },
          { label: "Avg. Market Rating", value: "4.3", icon: <ShootingStarIcon className="w-6 h-6 text-purple-500" />, color: "bg-purple-50 dark:bg-purple-500/10", badge: "87%" },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-5`}>
              {stat.icon}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</h4>
              </div>
              {stat.badge && (
                <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                  ↑ {stat.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Product Selector Mock */}
      <div className="bg-gray-50/50 dark:bg-white/[0.02] rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-8 mb-10">
        <div className="flex items-center justify-between mb-8">
            <h5 className="text-lg font-bold text-gray-900 dark:text-white">Select Product to Analyze</h5>
            <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </div>
                <div className="w-8 h-8 rounded-full border border-brand-500 flex items-center justify-center text-brand-500 bg-brand-500/10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>
        </div>
        <div className="flex gap-8 overflow-hidden">
          {[1, 2, 3].map((item) => (
            <div key={item} className={`flex-shrink-0 w-72 p-5 rounded-2xl bg-white dark:bg-gray-900 border ${item === 1 ? 'border-brand-500 shadow-xl shadow-brand-500/10' : 'border-gray-100 dark:border-gray-800 opacity-60'} transition-all`}>
              <div className="aspect-square rounded-xl bg-gray-50 dark:bg-gray-800 mb-5 flex items-center justify-center overflow-hidden relative">
                 {item === 1 && <div className="absolute top-3 right-3 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Selected</div>}
                 <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
              <div className="h-5 w-5/6 bg-gray-100 dark:bg-gray-800 rounded-full mb-3" />
              <div className="flex items-center justify-between">
                <div className="h-5 w-1/3 bg-gray-50 dark:bg-gray-800 rounded-full" />
                <div className="h-4 w-1/4 bg-blue-50 dark:bg-blue-500/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50/50 dark:bg-white/[0.02] rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-8">
            <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Sentiment Distribution</h5>
            <div className="flex items-center justify-center h-56">
                <div className="relative w-44 h-44">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path className="text-gray-200 dark:text-gray-800" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-green-500" strokeDasharray="65, 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-orange-500" strokeDasharray="20, 100" strokeDashoffset="-65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-red-500" strokeDasharray="15, 100" strokeDashoffset="-85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-gray-900 dark:text-white">65%</span>
                        <span className="text-xs font-bold text-green-500 tracking-widest uppercase mt-1">Positive</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-xs font-medium text-gray-500">Positive</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span><span className="text-xs font-medium text-gray-500">Neutral</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span><span className="text-xs font-medium text-gray-500">Negative</span></div>
            </div>
        </div>
        <div className="bg-gray-50/50 dark:bg-white/[0.02] rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-8">
            <div className="flex items-center justify-between mb-8">
                <h5 className="text-lg font-bold text-gray-900 dark:text-white">Market Sales Volume</h5>
                <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg uppercase tracking-tighter">Last 6 Months</span>
            </div>
            <div className="h-56 flex items-end gap-3 pb-4">
                {[30, 55, 45, 95, 75, 85, 60, 40, 70, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand-500/10 rounded-xl relative group overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-brand-500 rounded-xl transition-all duration-700 ease-out delay-150" 
                          style={{ height: `${h}%` }}
                        />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;

