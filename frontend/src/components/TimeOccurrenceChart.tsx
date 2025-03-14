import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { PathsGeneric } from "./cards/OccurrenceCard";

type Props = {
  paths: PathsGeneric<"normal">[] | [];
  defectivePaths: PathsGeneric<"defective">[] | [];
};

export function TimeOccurrenceChart({ paths, defectivePaths }: Props) {
  // Função para agrupar e acumular ocorrências por dia
  const groupByDay = (
    data: PathsGeneric<"normal">[] | PathsGeneric<"defective">[]
  ) => {
    const grouped: { [key: string]: number } = {};

    data.forEach((item) => {
      const day = item.registeredAt.substring(0, 10); // Extrai o ano, mês e dia (ex: "2025-03-08")
      if (!grouped[day]) {
        grouped[day] = 0;
      }
      grouped[day]++;
    });

    return grouped;
  };

  // Agrupa e acumula ocorrências normais e defeituosas por dia
  const normalGrouped = groupByDay(paths);
  const defectiveGrouped = groupByDay(defectivePaths);

  // Extrai os dias únicos e ordena
  const allDays = Array.from(
    new Set([...Object.keys(normalGrouped), ...Object.keys(defectiveGrouped)])
  ).sort();

  // Prepara os dados para o gráfico
  const normalData = allDays.map((day) => normalGrouped[day] || 0);
  const defectiveData = allDays.map((day) => defectiveGrouped[day] || 0);

  const series: ApexAxisChartSeries = [
    {
      name: "Caminhos normais",
      data: normalData,
    },
    {
      name: "Caminhos de despacho",
      data: defectiveData,
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
      type: "datetime",
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM",
          day: "dd",
          hour: "HH:mm",
        },
      },
      tickPlacement: "between",
      categories: allDays, // Usa os dias específicos para o eixo X
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
        const day = allDays[dataPointIndex];
        const name = seriesIndex === 0 ? "normais" : "infrações";
        return /*html*/ `
          <div
            style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
          >
            <h1 style="font-weight: 500">${day}</h1>
            <p>Total de ${name}</p>
            <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
          </div>
        `;
      },
    },
  };

  return <Chart height={177} options={options} series={series} type="line" />;
}
