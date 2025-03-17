import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { PathsGeneric } from "../cards/OccurrenceCard";

type Props = {
  paths: PathsGeneric<"normal">[] | [];
  defectivePaths: PathsGeneric<"defective">[] | [];
};

export function TimeOccurrenceChart({ paths, defectivePaths }: Props) {
  // Função para agrupar e acumular ocorrências por mês, mantendo o dia e o horário da ocorrência
  const groupByMonthWithDayAndTime = (
    data: PathsGeneric<"normal">[] | PathsGeneric<"defective">[]
  ) => {
    const grouped: { [key: string]: { count: number; timestamps: string[] } } =
      {};

    data.forEach((item) => {
      const month = item.registeredAt.substring(0, 7); // Extrai o ano e mês (ex: "2025-03")
      const timestamp = item.registeredAt; // Armazena o timestamp completo (ex: "2025-03-15T14:30:00")
      if (!grouped[month]) {
        grouped[month] = { count: 0, timestamps: [] };
      }
      grouped[month].count++;
      grouped[month].timestamps.push(timestamp); // Armazena os timestamps das ocorrências
    });

    return grouped;
  };

  // Agrupa e acumula ocorrências normais e defeituosas por mês, com dias e horários
  const normalGrouped = groupByMonthWithDayAndTime(paths);
  const defectiveGrouped = groupByMonthWithDayAndTime(defectivePaths);

  // Cria uma lista completa de meses do ano (de janeiro a dezembro)
  const currentYear = new Date().getFullYear(); // Pega o ano atual
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0"); // Formata o mês (ex: "01" para janeiro)
    return `${currentYear}-${month}`; // Formato: "YYYY-MM"
  });

  // Prepara os dados para o gráfico, preenchendo com 0 para meses sem registros
  const normalData = allMonths.map((month) => normalGrouped[month]?.count || 0);
  const defectiveData = allMonths.map(
    (month) => defectiveGrouped[month]?.count || 0
  );

  // Prepara os timestamps das ocorrências para o tooltip
  const normalTimestamps = allMonths.map(
    (month) => normalGrouped[month]?.timestamps || []
  );
  const defectiveTimestamps = allMonths.map(
    (month) => defectiveGrouped[month]?.timestamps || []
  );

  // Nomes dos meses para o eixo X
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

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
    colors: ["#1f9d0081", "#9d000081"], // Cores das séries
    stroke: {
      width: 1,
    },
    markers: {
      size: 6,
      colors: ["green", "red"],
      strokeWidth: 0,
      hover: {
        size: 8,
      },
      // Exibe markers apenas nos meses que possuem dados
      discrete: normalData
        .map((value, index) =>
          value > 0
            ? {
                seriesIndex: 0,
                dataPointIndex: index,
                fillColor: "green",
                size: 6,
              }
            : null
        )
        .concat(
          defectiveData.map((value, index) =>
            value > 0
              ? {
                  seriesIndex: 1,
                  dataPointIndex: index,
                  fillColor: "red",
                  size: 6,
                }
              : null
          )
        )
        .filter((marker) => marker !== null),
    },
    xaxis: {
      categories: monthNames, // Usa os nomes dos meses como categorias
      labels: {
        formatter: (value) => value, // Exibe os nomes dos meses diretamente
      },
      tickAmount: 12, // Força a exibição de 12 ticks
      tickPlacement: "between",
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
        const month = monthNames[dataPointIndex]; // Nome do mês
        const year = currentYear; // Ano atual
        const timestamps =
          seriesIndex === 0
            ? normalTimestamps[dataPointIndex]
            : defectiveTimestamps[dataPointIndex];
        const name = seriesIndex === 0 ? "normais" : "infrações";

        // Formata os timestamps para exibir "dia hora:minuto:segundo"
        const formattedTimestamps = timestamps.map((timestamp) => {
          const date = new Date(timestamp);
          const day = date.getDate().toString().padStart(2, "0"); // Dia (ex: "15")
          const hours = date.getHours().toString().padStart(2, "0"); // Hora (ex: "14")
          const minutes = date.getMinutes().toString().padStart(2, "0"); // Minuto (ex: "30")
          const seconds = date.getSeconds().toString().padStart(2, "0"); // Segundo (ex: "00")
          return `Dia ${day} às ${hours}:${minutes}:${seconds}`; // Formato: "dia hora:minuto:segundo"
        });

        return /*html*/ `
          <div
            style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
          >
            <h1 style="font-weight: 500">${month} ${year}</h1>
            <p>Horários das ocorrências:</p>
            <ul style="list-style-type: none; padding: 0; margin: 0;">
              ${formattedTimestamps
                .map((stamp) => `<li style="margin: 4px 0;">${stamp}</li>`)
                .join("")}
            </ul>
            <p>Total de ${name}</p>
            <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
          </div>
        `;
      },
    },
  };

  return <Chart height={177} options={options} series={series} type="line" />;
}
