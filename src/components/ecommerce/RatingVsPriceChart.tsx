"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RatingVsPriceChartProps {
  data: any[] | null;
  isLoading: boolean;
}

export default function RatingVsPriceChart({ data, isLoading }: RatingVsPriceChartProps) {
  // Group data by category for different colors
  let series: any[] = [];
  
  if (data && data.length > 0) {
    const groupedData = data.reduce((acc: any, item: any) => {
      const cat = item.category || 'Uncategorized';
      if (!acc[cat]) {
        acc[cat] = { name: cat, data: [] };
      }
      acc[cat].data.push({
        x: item.price,
        y: item.rating,
        productName: item.name,
        reviews: item.reviewCount
      });
      return acc;
    }, {});
    
    series = Object.values(groupedData);
  }

  const options: ApexOptions = {
    chart: {
      type: "scatter",
      height: 350,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: true, type: "xy" }
    },
    colors: ["#465FFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"],
    xaxis: {
      type: "numeric",
      title: { text: "Price ($)", style: { fontWeight: 500, color: "#64748B" } },
      labels: { formatter: (val: any) => `$${parseFloat(val).toFixed(0)}` },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      title: { text: "Average Rating", style: { fontWeight: 500, color: "#64748B" } },
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: { formatter: (val: any) => parseFloat(val).toFixed(1) },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: true } }
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right"
    },
    markers: {
      size: 6,
      strokeWidth: 0,
      hover: { size: 8 }
    },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const item = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div class="p-3 shadow-lg rounded-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
            <p class="font-semibold text-gray-800 dark:text-white/90 text-sm mb-1">${item.productName}</p>
            <p class="text-xs text-gray-500 mb-2">${w.config.series[seriesIndex].name}</p>
            <div class="flex items-center gap-3 text-sm">
              <div><span class="text-gray-400">Price:</span> <span class="font-medium">$${item.x}</span></div>
              <div><span class="text-gray-400">Rating:</span> <span class="font-medium text-amber-500">★ ${item.y}</span> <span class="text-xs text-gray-400">(${item.reviews})</span></div>
            </div>
          </div>
        `;
      }
    }
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-2 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
            Market Positioning (Price vs Rating)
            {isLoading && (
              <span className="text-xs text-brand-500 animate-pulse font-normal">(Loading...)</span>
            )}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Identify overpriced products and high-value hidden gems.
          </p>
        </div>
      </div>

      <div className="max-w-full pt-4">
        <div className="-ml-4 w-full pl-2">
          {(!data || data.length === 0) && !isLoading ? (
            <div className="flex h-[350px] items-center justify-center text-gray-400">
              No product price/rating data available.
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="scatter" height={350} />
          )}
        </div>
      </div>
    </div>
  );
}
