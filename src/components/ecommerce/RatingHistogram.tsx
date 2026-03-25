"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ComponentCard from "../common/ComponentCard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RatingDistProps {
  data: Array<{
    rating: number;
    count: number;
  }>;
}

export default function RatingHistogram({ data }: RatingDistProps) {
  const series = [
    {
      name: "Count",
      data: data.map((item) => item.count),
    },
  ];

  const options: ApexOptions = {
    colors: ["#fbbf24"],
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.map((item) => `${item.rating} Star${item.rating > 1 ? "s" : ""}`),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
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
    title: {
       text: "Overall Rating Spread",
       align: "center",
       style: {
           color: "#64748b",
           fontSize: "12px",
           fontWeight: 500
       }
    }
  };

  return (
    <ComponentCard title="Market Quality (Ratings)">
      <div className="h-[300px] w-full">
        <ReactApexChart options={options} series={series} type="bar" height="100%" />
      </div>
    </ComponentCard>
  );
}
