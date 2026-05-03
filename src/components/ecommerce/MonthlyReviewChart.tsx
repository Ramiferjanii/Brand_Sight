"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { ReviewActivityResponse } from "@/hooks/useDashboard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyReviewChartProps {
  reviewActivity: ReviewActivityResponse | null;
  isLoading: boolean;
  fetchReviewActivity: (months?: number, groupBy?: "category" | "domain") => Promise<any>;
}

export default function MonthlyReviewChart({
  reviewActivity,
  isLoading,
  fetchReviewActivity,
}: MonthlyReviewChartProps) {
  const [months, setMonths] = useState(6);
  const [groupBy, setGroupBy] = useState<"category" | "domain" | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchReviewActivity(months, groupBy);
  }, [months, groupBy, fetchReviewActivity]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  let categories: string[] = [];
  let series: { name: string; data: number[] }[] = [];

  if (reviewActivity && reviewActivity.success) {
    if (reviewActivity.series && reviewActivity.series.length > 0) {
      categories = reviewActivity.series[0].data.map((d) => d.month);
      series = reviewActivity.series.map((s) => ({
        name: s.groupValue,
        data: s.data.map((d) => d.reviewCount),
      }));
    } else if (reviewActivity.data) {
      categories = reviewActivity.data.map((d) => d.month);
      series = [
        {
          name: "Reviews",
          data: reviewActivity.data.map((d) => d.reviewCount),
        },
      ];
    }
  } else {
    categories = ["No Data"];
    series = [{ name: "Reviews", data: [0] }];
  }

  const colors = ["#465FFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

  const options: ApexOptions = {
    colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 200,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 600,
      },
    },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    yaxis: {
      labels: {
        formatter: (val: number) => Math.round(val).toString(),
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
      borderColor: "#f1f5f9",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.03,
        stops: [10, 100],
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} review${val !== 1 ? "s" : ""}`,
      },
      shared: true,
    },
  };

  const totalReviews =
    reviewActivity?.data?.reduce((sum, d) => sum + d.reviewCount, 0) ??
    reviewActivity?.totals?.reduce((sum, d) => sum + d.reviewCount, 0) ??
    0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
            Review Activity
            {isLoading && (
              <span className="text-xs text-brand-500 animate-pulse font-normal">(Loading…)</span>
            )}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalReviews} reviews scraped over the last {months} months
            {groupBy ? ` · by ${groupBy}` : ""}
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-48 p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Period</div>
            <DropdownItem
              onItemClick={() => { setMonths(6); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${months === 6 ? "text-brand-500" : "text-gray-600 dark:text-gray-300"}`}
            >
              Last 6 Months
            </DropdownItem>
            <DropdownItem
              onItemClick={() => { setMonths(12); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${months === 12 ? "text-brand-500" : "text-gray-600 dark:text-gray-300"}`}
            >
              Last 12 Months
            </DropdownItem>

            <div className="px-3 mt-2 pt-2 text-xs font-semibold text-gray-500 uppercase border-t border-gray-100 dark:border-gray-800">
              Group By
            </div>
            <DropdownItem
              onItemClick={() => { setGroupBy(undefined); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${groupBy === undefined ? "text-brand-500" : "text-gray-600 dark:text-gray-300"}`}
            >
              None (Total)
            </DropdownItem>
            <DropdownItem
              onItemClick={() => { setGroupBy("category"); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${groupBy === "category" ? "text-brand-500" : "text-gray-600 dark:text-gray-300"}`}
            >
              By Category
            </DropdownItem>
            <DropdownItem
              onItemClick={() => { setGroupBy("domain"); closeDropdown(); }}
              className={`flex w-full font-normal text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${groupBy === "domain" ? "text-brand-500" : "text-gray-600 dark:text-gray-300"}`}
            >
              By Domain
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar pt-6">
        <div className="-ml-4 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="area" height={200} />
        </div>
      </div>
    </div>
  );
}
