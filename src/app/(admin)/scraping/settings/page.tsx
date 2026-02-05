"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label"; // Assuming consistent Label component

interface Website {
  _id: string;
  name: string;
  url: string;
  category: string;
  lastScraped?: string;
  isActive: boolean;
}

export default function ScrapingSettingsPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "",
    description: "Added via Dashboard",
    scrapeFrequency: "daily"
  });

  const fetchWebsites = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/websites");
      const data = await res.json();
      setWebsites(data.websites || []); // Adjust based on actual API response structure
    } catch (error) {
      console.error("Failed to fetch websites", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchWebsites();
        setFormData({ name: "", url: "", category: "", description: "Added via Dashboard", scrapeFrequency: "daily" });
      }
    } catch (error) {
      console.error("Failed to add website", error);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:5000/api/websites/${id}`, { method: "DELETE" });
      fetchWebsites();
    } catch (error) {
      console.error("Failed to delete website", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Scraping Configuration</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your target websites and scraping settings.</p>
      </div>

      {/* Add Website Form */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Website</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label>Website Name</Label>
            <Input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g. Example Store" 
              required 
            />
          </div>
          <div className="lg:col-span-2">
            <Label>URL</Label>
            <Input 
              type="url" 
              name="url" 
              value={formData.url} 
              onChange={handleInputChange} 
              placeholder="https://example.com" 
              required 
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange} 
              placeholder="e.g. E-commerce" 
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-2">
            <Button type="submit">Add Website</Button>
          </div>
        </form>
      </div>

      {/* Websites Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Websites</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">URL</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Last Scraped</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : websites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No websites configured yet.</td>
                </tr>
              ) : (
                websites.map((site) => (
                  <tr key={site._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{site.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs truncate max-w-[200px]">{site.url}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {site.category || "General"}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                        {site.lastScraped ? new Date(site.lastScraped).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(site._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
