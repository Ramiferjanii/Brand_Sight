"use client";
import React from "react";
import api from "@/lib/api";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import { useAuth } from "@/context/AuthContext";

const ScrapingForm: React.FC = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = React.useState<{ value: string; label: string }[]>([]);
  const [selectedWebsite, setSelectedWebsite] = React.useState("");
  const [customUrl, setCustomUrl] = React.useState("");
  const [mode, setMode] = React.useState("static");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  
  // Filter states
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [nameFilter, setNameFilter] = React.useState("");
  const [referenceFilter, setReferenceFilter] = React.useState("");

  // Toast notification state
  const [toast, setToast] = React.useState<{ show: boolean; type: 'success' | 'error' | 'info'; message: string; details?: string }>({
    show: false, type: 'info', message: ''
  });

  React.useEffect(() => {
    if (!user) {
        setWebsites([]);
        return;
    }
    
    api.get("/websites")
      .then((res) => {
        const data = res.data;
        const options = (data.websites || []).map((w: any) => ({
          value: w.id, 
          label: w.name,
        }));
        setWebsites(options);
      })
      .catch((err) => {
          if (err.response?.status !== 401) {
              console.error("Failed to load websites", err);
          }
      });
  }, [user]);

  // Poll for scrape completion
  const pollForCompletion = (websiteId: string, initialLastScraped: string | null) => {
    if (!user) return;

    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setToast({ show: true, type: 'error', message: 'Scraping timed out', details: 'Check backend logs.' });
        setLoading(false);
        setMessage("");
        return;
      }

      try {
        const res = await api.get(`/websites/${websiteId}`);
        const website = res.data.website || res.data;
        const currentLastScraped = website.lastScraped; // String comparison is safer for equality check
        
        // Check if timestamp changed from the initial value
        if (currentLastScraped !== initialLastScraped) {
          clearInterval(interval);
          
          const scrapedData = website.scrapedData || {};
          let count = 0;
          if (scrapedData.count !== undefined) count = scrapedData.count;
          else if (Array.isArray(scrapedData.data)) count = scrapedData.data.length;
          else if (scrapedData.type === 'single') count = 1;
          
          setToast({ 
            show: true, 
            type: 'success', 
            message: 'Scraping completed!', 
            details: `Found ${count} products from ${website.name}`
          });
          setLoading(false);
          setMessage("");
          
          setTimeout(() => setToast(t => ({ ...t, show: false })), 8000);
        }
      } catch {
        // Retry
      }
    }, 5000);
  };

  const handleScrape = async () => {
    if (!selectedWebsite) {
      setMessage("Please select a website configuration first.");
      return;
    }
    setLoading(true);
    setMessage("");
    setToast({ show: false, type: 'info', message: '' });
    
    try {
      // 1. Get initial state safely
      const initRes = await api.get(`/websites/${selectedWebsite}`);
      const initialLastScraped = (initRes.data.website || initRes.data).lastScraped;

      // 2. Prepare payload
      const targetUrl = customUrl ? customUrl.trim() : undefined;
      const filters: any = {};
      if (minPrice) filters.minPrice = parseFloat(minPrice);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
      if (nameFilter) filters.name = nameFilter.trim();
      if (referenceFilter) filters.reference = referenceFilter.trim();
      
      const payload: any = { mode, url: targetUrl };
      if (Object.keys(filters).length > 0) {
        payload.filters = filters;
      }
      
      // 3. Trigger Scrape
      await api.post(`/websites/${selectedWebsite}/scrape-trigger`, payload);
      setMessage("Scraping in progress... This may take a few minutes.");
      
      // 4. Start polling using the initial timestamp
      pollForCompletion(selectedWebsite, initialLastScraped);
      
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Failed to trigger scraper.";
      setMessage(`Error: ${errMsg}`);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-24 right-6 z-[100] min-w-[320px] max-w-sm rounded-lg border-l-4 bg-white p-4 shadow-xl dark:bg-zinc-900 dark:text-white ${
            toast.type === 'success' ? 'border-green-500' : 
            toast.type === 'error' ? 'border-red-500' : 
            'border-blue-500'
          }`}
          style={{ animation: 'slideInRight 0.3s ease-out' }}
        >
          <div className="flex gap-3">
             {/* Icon */}
             <div className="flex-shrink-0">
               {toast.type === 'success' ? (
                 <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               ) : toast.type === 'error' ? (
                 <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               ) : (
                 <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               )}
             </div>
             <div className="flex-1">
               <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                 {toast.message}
               </h3>
               {toast.details && (
                 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                   {toast.details}
                 </p>
               )}
             </div>
             <button onClick={() => setToast(t => ({ ...t, show: false }))} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             </button>
          </div>
        </div>
      )}

      <ComponentCard title="Scraper Configuration" desc="Trigger a new scraping task.">
        <div className="space-y-5">
          
          {/* Website Selection */}
          <div>
             <Label>Select Website Platform</Label>
             <Select
                options={websites}
                placeholder="Choose a website (e.g. Tunisianet)..."
                onChange={(val) => setSelectedWebsite(val)}
             />
             <p className="text-xs text-gray-400 mt-1.5">
               Select the platform definition (contains selectors for parsing).
             </p>
          </div>

          {/* Custom URL Input */}
          <div>
              <Label>Target URL (Optional)</Label>
              <Input 
                  placeholder="https://www.tunisianet.com.tn/..." 
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  <strong>Leave empty</strong> to scrape the homepage.<br/>
                  <strong>Paste a Category Link</strong> (e.g. <em>.../laptops</em>) to scrape multiple products.<br/>
                  <strong>Paste a Product Link</strong> to scrape a single item.
              </p>
          </div>

          {/* Filter Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-2">
            <Label className="text-base font-semibold mb-3">Filters (Optional)</Label>
            <p className="text-xs text-gray-500 mb-4">Only scrape products matching these criteria</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Range */}
              <div>
                <Label>Min Price</Label>
                <Input 
                  type="number"
                  placeholder="1000" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Max Price</Label>
                <Input 
                  type="number"
                  placeholder="2000" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              
              {/* Name Filter */}
              <div>
                <Label>Product Name Contains</Label>
                <Input 
                  placeholder="laptop, asus, etc." 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              
              {/* Reference Filter */}
              <div>
                <Label>Reference Contains</Label>
                <Input 
                  placeholder="REF123, etc." 
                  value={referenceFilter}
                  onChange={(e) => setReferenceFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Scraper Mode</Label>
              <Select 
                options={[
                    { value: "static", label: "Static (Fast - Requests)" },
                    { value: "selenium", label: "Selenium (Slow - Browser)" }
                ]} 
                defaultValue="static"
                onChange={(val) => setMode(val)}
              />
            </div>
          </div>

          {/* Status Message */}
          {message && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${
                message.startsWith('Error') 
                  ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' 
                  : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
              }`}>
                  {message}
                  {loading && (
                    <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Waiting for results...
                    </div>
                  )}
              </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button 
              className="w-full justify-center py-3 text-base font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all" 
              onClick={handleScrape} 
              disabled={loading}
            >
              {loading ? (
                  <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Scraping in progress...</span>
                  </div>
              ) : (
                  "Start Scraper Job"
              )}
            </Button>
          </div>
        </div>
      </ComponentCard>

      {/* CSS animation for toast */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ScrapingForm;
