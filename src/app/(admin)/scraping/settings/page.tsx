"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import api from "@/lib/api";

interface Website {
  id: string;
  name: string;
  url: string;
  category: string;
  lastScraped?: string;
  isActive: boolean;
}

export default function ScrapingSettingsPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [newSite, setNewSite] = useState({
    name: "",
    url: "",
    category: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/websites');
      // api.get returns the response object, data is in response.data
      setWebsites(response.data.websites || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load websites');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSite(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.name || !newSite.url) return;

    try {
      setSubmitting(true);
      await api.post('/websites', newSite);

      await fetchWebsites();
      setNewSite({ name: "", url: "", category: "" });
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return;

    try {
      await api.delete(`/websites/${id}`);
      setWebsites(prev => prev.filter(site => site.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const response = await api.post('/websites/seed');
      alert(`Seeding complete: ${response.data.message}`);
      fetchWebsites();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scraping Settings</h1>
        <Button onClick={handleSeed} disabled={seeding} className="bg-green-600 hover:bg-green-700">
            {seeding ? "Seeding..." : "Seed Defaults"}
        </Button>
      </div>

      {/* Add Website Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Website</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="name">Website Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Amazon"
              value={newSite.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              placeholder="https://..."
              value={newSite.url}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              placeholder="e.g. E-commerce"
              value={newSite.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Website"}
            </Button>
          </div>
        </form>
      </div>

      {/* Websites List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monitored Websites</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : websites.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No websites added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Scraped</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {websites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{site.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs truncate max-w-[200px]" title={site.url}>{site.url}</td>
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
                        onClick={() => handleDelete(site.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
