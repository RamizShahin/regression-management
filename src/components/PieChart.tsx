// PieChart.tsx
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface PieChartProps {
  title?: string;
  series: number[];
  labels: string[];
}

const PieChart: React.FC<PieChartProps> = ({
  title = "Pie Chart Overview",
  series,
  labels,
}) => {
  const [chartHeight, setChartHeight] = useState<number | string>(350);

  useEffect(() => {
    const updateHeight = () => {
      const isSmall = window.innerWidth < 1024;
      setChartHeight(isSmall ? "100%" : 350);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const generateColors = (count: number) => {
    const baseColors = [
      "#1C64F2", "#16BDCA", "#FDBA8C", "#F43F5E", "#10B981", "#8B5CF6", "#F59E0B",
    ];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  const options: ApexOptions = {
    series,
    labels,
    chart: {
      height: chartHeight,
      type: "pie",
    },
    colors: generateColors(series.length),
    stroke: {
      colors: ["#fff"],
    },
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: "#D1D5DB",
      },
    },
    tooltip: {
      enabled: true,
    },
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-md w-full h-full">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={chartHeight}
      />
    </div>
  );
};

export default PieChart;
