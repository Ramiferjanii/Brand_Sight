"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ComponentCard from "../common/ComponentCard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PriceHistoryProps {
  data: Array<{
    timestamp: string;
    priceAmount: number;
  }>;
  productName: string;
}

export default function PriceHistoryChart({ data, productName }: PriceHistoryProps) {
  // Check if data is empty or all elements are valid
  if (!data || data.length === 0) {
    return (
      <ComponentCard title={`Price History: ${productName}`}>
        <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
             <span>No price history available.</span>
        </div>
      </ComponentCard>
    );
  }

  const series = [
    {
      name: "Price",
      data: data.map((item) => ({
        x: new Date(item.timestamp).getTime(),
        y: item.priceAmount,
      })),
    },
  ];

  const options: ApexOptions = {
    colors: ["#3b82f6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
        type: 'x',  
        autoScaleYaxis: true
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Price",
        style: {
           color: "#64748b",
           fontSize: "12px",
           fontWeight: 500
        }
      },
      labels: {
        formatter: (val) => val.toFixed(2)
      }
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <ComponentCard title={`Price History: ${productName}`}>
      <div className="h-[300px] w-full">
        <ReactApexChart options={options} series={series} type="area" height="100%" />
      </div>
    </ComponentCard>
  );
}
