import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { format } from "date-fns";
import type { ApexOptions } from "apexcharts";

interface LineChartProps {
  title?: string;
  series: ApexAxisChartSeries;
  categories: string[];
  onDateChange: (from: string, to: string) => void;
  defaultFromDate?: string;
  defaultToDate?: string;
}

const generateColors = (count: number) => {
  const baseColors = [
    "#3b82f6",
    "#ec4899",
    "#22d3ee",
    "#facc15",
    "#10b981",
    "#a855f7",
    "#f97316",
    "#ef4444",
    "#14b8a6",
    "#8b5cf6",
  ];
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
};

const LineChart: React.FC<LineChartProps> = ({
  title,
  series,
  categories,
  onDateChange,
  defaultFromDate,
  defaultToDate,
}) => {
  const [fromDate, setFromDate] = useState(defaultFromDate || "");
  const [toDate, setToDate] = useState(defaultToDate || "");

  useEffect(() => {
    onDateChange(fromDate, toDate);
  }, [fromDate, toDate]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: "100%",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: generateColors(series.length),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories,
      labels: {
        trim: false,
        rotate: -45,
        rotateAlways: true,
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          colors: "#9CA3AF",
        },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: "#E5E7EB" },
    },
    grid: { show: false },
    tooltip: { shared: true, intersect: false, theme: "dark" },
    dataLabels: { enabled: false },
    fill: { opacity: 1 },
    states: {
      hover: { filter: { type: "darken" } },
    },
    stroke: { show: false },
  };

  return (
    <div className="m-auto bg-gray-900 rounded-xl p-6 pb-0 shadow-md max-w-7xl lg: h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-4 text-sm w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-gray-400">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1.5 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-gray-400">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1.5 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-2">
        Showing data{" "}
        {fromDate && toDate ? (
          <>
            from <strong>{format(new Date(fromDate), "MMM d, yyyy")}</strong> to{" "}
            <strong>{format(new Date(toDate), "MMM d, yyyy")}</strong>
          </>
        ) : fromDate ? (
          <>
            From <strong>{format(new Date(fromDate), "MMM d, yyyy")}</strong>
          </>
        ) : toDate ? (
          <>
            Until <strong>{format(new Date(toDate), "MMM d, yyyy")}</strong>
          </>
        ) : (
          <strong>for All dates</strong>
        )}
      </p>

      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={320}
      />
    </div>
  );
};

export default LineChart;
