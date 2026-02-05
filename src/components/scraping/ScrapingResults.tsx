"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { DownloadIcon } from "@/icons";

const ScrapingResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/websites");
        const data = await res.json();
        setResults(data.websites || []);
    } catch (error) {
        console.error("Failed to fetch results", error);
    } finally {
        setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResults();
    // Optional: Auto-refresh every 10 seconds to show updates
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredResults = results.filter(item => 
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.url || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.scrapedData?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ComponentCard title="Scraping Results" desc="View extracted data from your configured websites.">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search results..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" startIcon={<DownloadIcon />}>
              Export JSON
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Website Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Scraped Title</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Links Found</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Images Found</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Last Scrape</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                  <tr><td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">Loading results...</td></tr>
              ) : filteredResults.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">No results found (Try triggering a scrape!)</td></tr>
              ) : (
                filteredResults.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                    <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                        <div className="text-xs text-gray-400 font-normal">{item.url}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={item.scrapedData?.title}>
                        {item.scrapedData?.title || "No data yet"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.scrapedData?.linksCount || 0}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.scrapedData?.imagesCount || 0}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                        {item.lastScraped ? new Date(item.lastScraped).toLocaleString() : "Never"}
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ScrapingResults;
