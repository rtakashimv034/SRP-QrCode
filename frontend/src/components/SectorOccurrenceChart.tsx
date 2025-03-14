import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { SectorProps } from "./pages/Reports";

type Props = {
  sectors: SectorProps[];
};

export function SectorOccurrenceChart({ sectors }: Props) {
  const series: ApexAxisChartSeries = [
    {
      name: "Caminhos normais",
      data: sectors.map((s) => s.paths.length),
    },
    {
      name: "Caminhos de despacho",
      data: sectors.map((s) => s.defectivePaths.length),
    },
  ];
  const options: ApexOptions = {
    colors: ["#1f9d0081", "#9d000081"], // Azul escuro
    stroke: {
      width: 1,
    },
    markers: {
      size: 6,
      colors: ["green", "red"],
      strokeWidth: 0,
    },
    xaxis: {
      type: "category",
      tickPlacement: "between",
      categories: sectors.map((s) => `#${s.id}`),
    },
    yaxis: {
      show: true,
      min: 0,
      floating: false,
      forceNiceScale: true,
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
        const name = sectors[dataPointIndex].name;
        const normal =
          value === series[0][dataPointIndex] ? "normais" : "infrações";
        return /*html*/ `
          <div
            style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
          >
            <h1 style="font-weight: 500">${name}</h1>
            <p>Total de ${normal}</p>
            <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
          </div>
        `;
      },
    },
  };

  return <Chart height={177} options={options} series={series} type="line" />;
}
