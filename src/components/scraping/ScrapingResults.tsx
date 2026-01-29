"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { DownloadIcon } from "@/icons";

const mockResults = [
  { id: 1, title: "iPhone 15 Pro", price: "$999", source: "Amazon", status: "Success", date: "2024-05-20" },
  { id: 2, title: "Samsung Galaxy S24", price: "$899", source: "eBay", status: "Success", date: "2024-05-21" },
  { id: 3, title: "MacBook Air M3", price: "$1099", source: "BestBuy", status: "Success", date: "2024-05-22" },
  { id: 4, title: "Sony WH-1000XM5", price: "$348", source: "Amazon", status: "Error", date: "2024-05-22" },
];

const ScrapingResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = mockResults.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ComponentCard title="Scraping Results" desc="View and export your extracted data.">
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
              Export CSV
            </Button>
            <Button variant="outline" size="sm" startIcon={<DownloadIcon />}>
              Export JSON
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredResults.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.title}</td>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.price}</td>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.source}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Success' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ScrapingResults;
