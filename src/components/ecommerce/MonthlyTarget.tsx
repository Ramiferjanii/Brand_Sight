"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SentimentProps {
  sentiment?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  onRefresh?: () => void;
}

export default function MonthlyTarget({ sentiment, onRefresh }: SentimentProps) {
  const data = React.useMemo(() => [
    Number(sentiment?.positive || 0),
    Number(sentiment?.neutral || 0),
    Number(sentiment?.negative || 0),
  ], [sentiment]);
  
  const total = React.useMemo(() => data.reduce((a, b) => a + b, 0), [data]);
  const positiveRate = React.useMemo(() => total > 0 ? ((data[0] / total) * 100).toFixed(0) : "0", [total, data]);

  const options: ApexOptions = React.useMemo(() => ({
    colors: ["#10B981", "#F59E0B", "#EF4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 400,
              offsetY: 20,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 600,
              offsetY: -20,
              formatter: (val) => `${val}`,
            },
            total: {
              show: true,
              label: "Reviews",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    labels: ["Positive", "Neutral", "Negative"],
    stroke: {
      width: 0,
    },
  }), [total]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 sm:p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Market Sentiment
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aggregate customer emotion
          </p>
        </div>
        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem onItemClick={() => {
                setIsOpen(false);
                if (onRefresh) onRefresh();
            }}>Recalculate Data</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="h-[240px] w-full flex justify-center">
          <ReactApexChart key={total} options={options} series={data} type="donut" height={240} />
        </div>

        <div className="mt-8 w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Positive</span>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-white">{data[0]}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Neutral</span>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-white">{data[1]}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Negative</span>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-white">{data[2]}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 w-full text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overall, <span className="text-emerald-600 font-bold">{positiveRate}%</span> of reviews are positive.
          </p>
        </div>
      </div>
    </div>
  );
}
