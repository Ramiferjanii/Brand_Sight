"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ComponentCard from "../common/ComponentCard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DomainReviewsProps {
  data: Array<{
    domain: string;
    count: number;
  }>;
}

export default function ReviewsByDomainChart({ data }: DomainReviewsProps) {
  const series = [
    {
      name: "Reviews",
      data: data.map((item) => item.count),
    },
  ];

  const options: ApexOptions = {
    colors: ["#6366f1"],
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
    },
    xaxis: {
      categories: data.map((item) => item.domain),
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <ComponentCard title="Reviews by Domain">
      <div className="h-[300px] w-full">
        <ReactApexChart options={options} series={series} type="bar" height="100%" />
      </div>
    </ComponentCard>
  );
}
