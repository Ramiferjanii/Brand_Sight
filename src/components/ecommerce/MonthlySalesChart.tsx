"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { SalesVolumeResponse } from "@/hooks/useDashboard";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlySalesProps {
  salesVolume: SalesVolumeResponse | null;
  isLoading: boolean;
  fetchSalesVolume: (months?: number, groupBy?: 'category' | 'domain') => Promise<any>;
  fallbackData: Array<{ month: string; sales: number }>;
}

export default function MonthlySalesChart({ salesVolume, isLoading, fetchSalesVolume, fallbackData }: MonthlySalesProps) {
  const [months, setMonths] = useState(6);
  const [groupBy, setGroupBy] = useState<'category' | 'domain' | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchSalesVolume(months, groupBy);
  }, [months, groupBy, fetchSalesVolume]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  let categories: string[] = [];
  let series: { name: string; data: number[] }[] = [];

  // Parse new dynamic response if available, else user fallback
  if (salesVolume && salesVolume.success) {
      if (salesVolume.series && salesVolume.series.length > 0) {
          // Grouped by Category or Domain
          categories = salesVolume.series[0].data.map(d => d.month);
          series = salesVolume.series.map(s => ({
              name: s.groupValue,
              data: s.data.map(d => d.estimatedSales)
          }));
      } else if (salesVolume.data) {
          // No Group
          categories = salesVolume.data.map(d => d.month);
          series = [{
              name: "Market Sales",
              data: salesVolume.data.map(d => d.estimatedSales)
          }];
      }
  } else {
      categories = fallbackData?.length > 0 ? fallbackData.map(d => d.month) : ["No Data"];
      series = [{
          name: "Market Sales",
          data: fallbackData?.length > 0 ? fallbackData.map(d => d.sales) : [0]
      }];
  }

  // Pre-defined vibrant colors for grouped series
  const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

  const options: ApexOptions = {
    colors: colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
         enabled: false,
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100],
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Est. Sales`,
      },
      shared: true,
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
             Estimated Market Sales {isLoading && <span className="text-xs text-brand-500 ml-2 animate-pulse">(Loading...)</span>}
           </h3>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
             Sales volume over {months} months {groupBy ? `by ${groupBy}` : ''}
           </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-48 p-2"
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Period</div>
            <DropdownItem
              onItemClick={() => { setMonths(6); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${months === 6 ? 'text-brand-500' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Last 6 Months
            </DropdownItem>
            <DropdownItem
             onItemClick={() => { setMonths(12); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${months === 12 ? 'text-brand-500' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Last 12 Months
            </DropdownItem>
            
            <div className="px-3 md-2 mt-2 text-xs font-semibold text-gray-500 uppercase border-t border-gray-100 dark:border-gray-800 pt-2">Group By</div>
            <DropdownItem
              onItemClick={() => { setGroupBy(undefined); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${groupBy === undefined ? 'text-brand-500' : 'text-gray-600 dark:text-gray-300'}`}
            >
              None (Total)
            </DropdownItem>
             <DropdownItem
              onItemClick={() => { setGroupBy('category'); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${groupBy === 'category' ? 'text-brand-500' : 'text-gray-600 dark:text-gray-300'}`}
            >
              By Category
            </DropdownItem>
             <DropdownItem
              onItemClick={() => { setGroupBy('domain'); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${groupBy === 'domain' ? 'text-brand-500' : 'text-gray-600 dark:text-gray-300'}`}
            >
              By Domain
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar pt-6">
        <div className="-ml-4 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
