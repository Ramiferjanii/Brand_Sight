"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { useReports } from "@/hooks/useReports";
import { BoxCubeIcon, PieChartIcon, HorizontaLDots } from "@/icons";

export default function MarketReports() {
  const { categories, report, isGenerating, error, generateReport } = useReports();
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleGenerate = () => {
    if (!selectedCategory) return;
    generateReport(selectedCategory);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          AI Market Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Analyze market trends and customer satisfaction for specific categories using Groq Llama 3.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Selection Card */}
        <div className="md:col-span-4">
          <ComponentCard title="Generate New Report">
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Category to Analyze
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedCategory || isGenerating}
                className="w-full flex justify-center items-center py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
              >
                {isGenerating ? (
                   <>
                     <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                     Analyzing Data...
                   </>
                ) : "Generate Professional Report"}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-xs">
                    {error}
                </div>
              )}
            </div>
          </ComponentCard>
        </div>

        {/* Report Card */}
        <div className="md:col-span-8">
          <ComponentCard title="Professional Market Insight">
            {report ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-50 text-brand-500 rounded-lg">
                         <PieChartIcon className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-800 dark:text-white uppercase tracking-wider">{selectedCategory}</h3>
                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                             report.marketMood.includes('Highly Positive') ? 'bg-green-100 text-green-700' : 
                             report.marketMood.includes('Positive') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                         }`}>
                             Market Mood: {report.marketMood}
                         </span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="bg-brand-50/30 p-4 rounded-xl border border-brand-100 dark:border-brand-900/40">
                   <p className="text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed">
                      "{report.averagePricingInsight}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-bold text-green-600 mb-3 flex items-center gap-2 uppercase tracking-tight">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Key Strengths</h4>
                        <ul className="space-y-2">
                           {report.strengths.map((s, i) => (
                               <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <span className="text-green-500 pt-1 font-bold">✓</span> {s}
                               </li>
                           ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2 uppercase tracking-tight">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Known Weaknesses</h4>
                        <ul className="space-y-2">
                           {report.weaknesses.map((s, i) => (
                               <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <span className="text-red-500 pt-1 font-bold">×</span> {s}
                               </li>
                           ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-800">
                    <h4 className="text-base font-bold text-gray-800 dark:text-white mb-2">Growth Potential</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {report.growthPotential}
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex items-center gap-4">
                    <BoxCubeIcon className="w-10 h-10 text-brand-500 opacity-20" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span className="font-bold">Analyst Verdict:</span> {report.conclusion}
                    </p>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center p-12 space-y-4">
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full">
                    <PieChartIcon className="w-12 h-12 text-gray-300" />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-500">No Report Selected</h4>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                        Please select a product category from the left panel and click 'Generate' to create a comprehensive market research report powered by Groq Llama 3 AI.
                    </p>
                 </div>
              </div>
            )}
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
