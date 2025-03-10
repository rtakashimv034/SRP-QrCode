import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

type Props = {
  categories: string[];
  label: string[];
  data: number[];
};

export function OccurrenceChart({ categories, data, label }: Props) {
  const series: ApexAxisChartSeries = [
    {
      name: "Ocorrências",
      data,
    },
  ];
  const options: ApexOptions = {
    colors: ["#1E293B"], // Azul escuro
    stroke: {
      width: 2,
    },
    markers: {
      size: 6,
      colors: "black",
      strokeWidth: 0,
    },
    xaxis: {
      type: "category",
      tickPlacement: "between",
      categories,
    },
    yaxis: {
      show: true,
      min: 0,
    },
    tooltip: {
      enabled: true,
      shared: false,
      onDatasetHover: {
        highlightDataSeries: true,
      },
      intersect: true,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex];
        return /*html*/ `
          <div
            style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
          >
            <h1 style="font-weight: 500">${label}</h1>
            <p>Total de Infrações</p>
            <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
          </div>
        `;
      },
    },
  };

  return <Chart height={177} options={options} series={series} type="line" />;
}
