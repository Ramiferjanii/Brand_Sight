"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { DownloadIcon } from "@/icons"; // Use standard or custom icons

const ScrapingHistory: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
        setError(null);
        const res = await api.get("/websites");
        const data = res.data;
        setResults(data.websites || []);
    } catch (err: any) {
        console.error("Failed to fetch results", err);
        setError("Failed to load scraping history.");
    } finally {
        setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000); // 10s refresh on this page
    return () => clearInterval(interval);
  }, []);

  const handleDownloadCsv = async (websiteId: string, websiteName: string) => {
    try {
        setExportingId(websiteId);
        // Note: Using window.location to trigger native download prompt or using blob
        const response = await api.get(`/products/export/${websiteId}`, {
            responseType: 'blob'
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${websiteName.replace(/\s+/g, '_')}_products.csv`);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Failed to export products:", err);
        alert("Could not export products. Ensure the task has successfully found items.");
    } finally {
        setExportingId(null);
    }
  }

  const filteredResults = results.filter(item => 
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.url || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadges = (data: any, status: string = 'idle') => {
      if (status === 'in-progress') {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 animate-pulse">
                In Progress
            </span>
          );
      }
      if (status === 'failed') {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                Failed
            </span>
          );
      }

      if (!data) return <span className="text-gray-400">-</span>;
      if (data.type === 'list') {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                Category Scan
            </span>
          );
      }
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            Product Page
        </span>
      );
  };

  return (
    <ComponentCard title="Full Scraping History" desc="View all scraping jobs, details, and download the data.">
      <div className="space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search websites..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchResults}>
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800 mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last URL Scraped</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Items Founded</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Completed On</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && results.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">Loading history...</td></tr>
              ) : error ? (
                   <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/10">
                       {error}
                   </td></tr>
              ) : filteredResults.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No scraping history found.</td></tr>
              ) : (
                filteredResults.map((item) => {
                    const data = item.scrapedData || {};
                    const isList = data.type === 'list';
                    const count = (item.productCount || 0) > 0 ? item.productCount : (isList ? (data.count || (Array.isArray(data.data) ? data.data.length : 0)) : (data.type === 'single' || data.title ? 1 : 0));
                    
                    return (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition bg-white dark:bg-gray-900">
                            <td className="px-4 py-4">
                                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                                <span className="block text-xs text-gray-400 truncate max-w-[150px]">{item.url}</span>
                            </td>
                            <td className="px-4 py-4 max-w-xs">
                                <div className="text-sm text-gray-700 dark:text-gray-300 truncate" title={data.url || item.url}>
                                    {data.url || "-"}
                                </div>
                            </td>
                            <td className="px-4 py-4">
                                {getBadges(data, item.lastScrapeStatus)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                {count}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 text-right whitespace-nowrap">
                                {item.lastScraped ? new Date(item.lastScraped).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                }) : "Never"}
                            </td>
                            <td className="px-4 py-4 text-right">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={count === 0 || exportingId === item.id}
                                    onClick={() => handleDownloadCsv(item.id, item.name)}
                                    className="inline-flex items-center gap-2 font-medium"
                                >
                                    {exportingId === item.id ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full font-medium"></span>
                                    ) : (
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    )}
                                    CSV
                                </Button>
                            </td>
                        </tr>
                    );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ScrapingHistory;
