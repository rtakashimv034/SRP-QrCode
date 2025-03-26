import { SectorProps } from "@/types";
import { ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react"; // Importe useRef e useEffect
import Chart from "react-apexcharts";

type Props = {
  sectors: SectorProps[];
};

export function SectorOccurrenceChart({ sectors }: Props) {
  // Crie uma referência para o gráfico
  const chartRef = useRef<Chart | null>(null);

  // Prepare os dados iniciais do gráfico
  const initialSeries: ApexAxisChartSeries = [
    {
      name: "Caminhos normais",
      data: sectors.map((s) => s.paths?.length || 0),
    },
    {
      name: "Caminhos de despacho",
      data: sectors.map((s) => s.defectivePaths?.length || 0),
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

  // Atualize os dados do gráfico quando os setores mudarem
  useEffect(() => {
    if (chartRef.current) {
      const newSeries = [
        {
          name: "Caminhos normais",
          data: sectors.map((s) => s.paths?.length),
        },
        {
          name: "Caminhos de despacho",
          data: sectors.map((s) => s.defectivePaths?.length),
        },
      ];

      // Atualize os dados do gráfico sem re-renderizar o componente
      chartRef.current.updateSeries(newSeries);
    }
  }, [sectors]);

  return (
    <Chart
      height={177}
      options={options}
      series={initialSeries}
      type="line"
      ref={chartRef} // Passe a referência para o gráfico
    />
  );
}
