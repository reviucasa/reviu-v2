"use client";

import { WeeklyStats } from "@/models/stats";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const ReviewsColumnsChart = ({ data }: { data: WeeklyStats[] }) => {
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Space Grotesk', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 370,
    },
    colors: ["#D1F780", "#9E80F7"],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: data.map((d) => d.documentId),
      axisBorder: {
        show: true,
      },
    },
    tooltip: {
      theme: "light",
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart: any = [
    {
      name: "Total Reviews",
      data: data.map((d) => d.reviewsCount),
    },
    {
      name: "New Weekly Reviews",
      data: data.map((d) => d.reviewsWeekly),
    },
  ];

  return (
    <Chart
      options={optionscolumnchart}
      series={seriescolumnchart}
      type="bar"
      height={320}
      width={"100%"}
    />
  );
};
