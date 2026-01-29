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
  return (
    <ComponentCard title="Scraper Configuration" desc="Set up your scraping parameters below.">
      <div className="space-y-4">
        <div>
          <Label>Target URL</Label>
          <Input 
            type="text" 
            placeholder="https://example.com/products" 
            hint="Enter the full URL of the page you want to scrape."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Scraper Type</Label>
            <Select 
              options={scraperOptions} 
              defaultValue="static"
              onChange={(val) => console.log(val)}
            />
          </div>
          <div>
            <Label>Max Pages</Label>
            <Input 
              type="number" 
              defaultValue={1} 
              min="1"
              placeholder="1"
            />
          </div>
        </div>

        <div>
          <Label>CSS Selector (Optional)</Label>
          <Input 
            type="text" 
            placeholder=".product-item or #content" 
            hint="Leave empty to extract all text or common elements."
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button className="w-full md:w-auto">
            Start Scraper
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            Schedule Task
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ScrapingForm;
