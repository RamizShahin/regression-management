import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { format, parse } from "date-fns";

interface AreaChartProps {
  title?: string;
  series: ApexAxisChartSeries;
  categories: string[];
  onDateChange: (from: string, to: string) => void;
  defaultFrom?: string; // "YYYY-MM"
  defaultTo?: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  title = "Tests Over Time",
  series,
  categories,
  onDateChange,
  defaultFrom = "2023-06",
  defaultTo = "2026-04",
}) => {
  const [fromMonth, setFromMonth] = useState(defaultFrom);
  const [toMonth, setToMonth] = useState(defaultTo);

  useEffect(() => {
    if (fromMonth && toMonth) {
      onDateChange(fromMonth, toMonth);
    }
  }, [fromMonth, toMonth]);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: "100%",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0,
      },
    },
    grid: {
      strokeDashArray: 4,
      padding: { left: 2, right: 2, top: 0 },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  const formatMonth = (monthStr: string) => {
    const date = parse(monthStr + "-01", "yyyy-MM-dd", new Date());
    return format(date, "MMMM yyyy");
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-md w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        <div className="flex flex-col sm:flex-row gap-4 text-sm w-full sm:w-auto">
          <div>
            <label className="mb-1 text-gray-400 block">From</label>
            <input
              type="month"
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1.5"
            />
          </div>
          <div>
            <label className="mb-1 text-gray-400 block">To</label>
            <input
              type="month"
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1.5"
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-2">
        Showing data from <strong>{formatMonth(fromMonth)}</strong> to{" "}
        <strong>{formatMonth(toMonth)}</strong>
      </p>

      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={320}
      />
    </div>
  );
};

export default AreaChart;
