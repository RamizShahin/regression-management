import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface RadialChartProps {
  title?: string;
  series: number[];
  labels: string[];
}

const RadialChart: React.FC<RadialChartProps> = ({
  title = "Progress Overview",
  series,
  labels,
}) => {
  const [chartHeight, setChartHeight] = useState<number | string>(350);

  useEffect(() => {
    const updateHeight = () => {
      const isSmall = window.innerWidth < 1024;
      setChartHeight(isSmall ? "100%" : 350);
    };

    updateHeight(); // set on mount
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const generateColors = (count: number) => {
    const baseColors = [
      "#1C64F2",
      "#16BDCA",
      "#FDBA8C",
      "#F43F5E",
      "#10B981",
      "#8B5CF6",
      "#F59E0B",
    ];
    return Array.from(
      { length: count },
      (_, i) => baseColors[i % baseColors.length]
    );
  };

  const total = series.reduce((sum, val) => sum + val, 0);
  const percentages =
    total > 0 ? series.map((val) => (val / total) * 100) : series.map(() => 0);

  const options: ApexOptions = {
    series,
    labels,
    chart: {
      height: chartHeight,
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
    },
    colors: generateColors(series.length),
    plotOptions: {
      radialBar: {
        track: {
          background: "#E5E7EB",
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: "14px",
            color: "#D1D5DB",
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "16px",
            color: "#ffffff",
            formatter: (val: number) => `${val}%`,
          },
        },
        hollow: {
          margin: 0,
          size: "32%",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: "#E5E7EB",
      },
    },
    tooltip: {
      enabled: true,
      x: { show: false },
      y: {
        formatter: (_val, opts) => {
          return `${series[opts.seriesIndex]}`;
        },
      },
    },
    grid: {
      show: false,
    },
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-md w-full h-full">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <ReactApexChart
        options={options}
        series={percentages}
        type="radialBar"
        height={chartHeight}
      />
    </div>
  );
};

export default RadialChart;
