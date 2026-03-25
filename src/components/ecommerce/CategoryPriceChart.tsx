"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ComponentCard from "../common/ComponentCard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CategoryPriceProps {
  data: Array<{
    category: string;
    avgPrice: number;
  }>;
}

export default function CategoryPriceChart({ data }: CategoryPriceProps) {
  const series = [
    {
      name: "Avg Price",
      data: data.map((item) => item.avgPrice),
    },
  ];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.map((item) => item.category),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Price (TND)",
        style: {
           color: "#64748b",
           fontSize: "12px",
           fontWeight: 500
        }
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} TND`,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <ComponentCard title="Price by Category">
      <div className="h-[300px] w-full">
        <ReactApexChart options={options} series={series} type="bar" height="100%" />
      </div>
    </ComponentCard>
  );
}
