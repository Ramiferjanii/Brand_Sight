"use client";
import React from "react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

const scraperOptions = [
  { value: "static", label: "Static (Fast)" },
  { value: "dynamic", label: "Dynamic (Puppeteer/Playwright)" },
  { value: "api", label: "API Extract" },
];

const ScrapingForm: React.FC = () => {
  const [websites, setWebsites] = React.useState<{ value: string; label: string }[]>([]);
  const [selectedWebsite, setSelectedWebsite] = React.useState("");
  const [mode, setMode] = React.useState("static");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:5000/api/websites")
      .then((res) => res.json())
      .then((data) => {
        const options = data.websites.map((w: any) => ({
          value: w._id,
          label: w.name + " (" + w.url + ")",
        }));
        setWebsites(options);
      })
      .catch((err) => console.error("Failed to load websites", err));
  }, []);

  const handleScrape = async () => {
    if (!selectedWebsite) {
      setMessage("Please select a website first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${selectedWebsite}/scrape-trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Failed to trigger scraper.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Scraper Configuration" desc="Trigger a new scraping task.">
      <div className="space-y-4">
        <div>
           <Label>Select Website</Label>
           <Select
              options={websites}
              placeholder="Choose a website..."
              onChange={(val) => setSelectedWebsite(val)}
           />
           <p className="text-xs text-gray-500 mt-1">Configure new websites in Settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Scraper Mode</Label>
            <Select 
              options={[
                  { value: "static", label: "Static (Fast)" },
                  { value: "selenium", label: "Selenium (Dynamic)" }
              ]} 
              defaultValue="static"
              onChange={(val) => setMode(val)}
            />
          </div>
        </div>

        {message && (
            <div className={`p-3 rounded-lg text-sm ${message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
            </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <Button 
            className="w-full md:w-auto" 
            onClick={handleScrape} 
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Scraper"}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ScrapingForm;
