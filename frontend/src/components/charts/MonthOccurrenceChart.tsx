import { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react"; // Importar useState para gerenciar o estado do ano selecionado
import Chart from "react-apexcharts";
import { PathsGeneric } from "../cards/OccurrenceCard";

type Props = {
  paths: PathsGeneric<"normal">[] | [];
  defectivePaths: PathsGeneric<"defective">[] | [];
};

export function MonthOccurrenceChart({ paths, defectivePaths }: Props) {
  const chartRef = useRef<any>(null);

  // Estado para armazenar o ano selecionado pelo usuário
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  // Filtra os dados para o ano selecionado
  const filterDataByYear = (
    data: PathsGeneric<"normal">[] | PathsGeneric<"defective">[],
    year: number
  ) => {
    return data.filter((item) => {
      const itemYear = new Date(item.registeredAt).getFullYear();
      return itemYear === year;
    });
  };

  // Filtra os dados para o ano selecionado
  const filteredPaths = filterDataByYear(paths, selectedYear);
  const filteredDefectivePaths = filterDataByYear(defectivePaths, selectedYear);

  // Agrupa e acumula ocorrências normais e defeituosas por mês, com dias e horários
  const normalGrouped = groupByMonthWithDayAndTime(filteredPaths);
  const defectiveGrouped = groupByMonthWithDayAndTime(filteredDefectivePaths);

  // Cria uma lista completa de meses do ano (de janeiro a dezembro)
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0"); // Formata o mês (ex: "01" para janeiro)
    return `${selectedYear}-${month}`; // Formato: "YYYY-MM"
  });

  // Prepara os dados para o gráfico, preenchendo com 0 para meses sem registros
  const normalData = allMonths.map((month) => normalGrouped[month]?.count || 0);
  const defectiveData = allMonths.map(
    (month) => defectiveGrouped[month]?.count || 0
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

  const initialSeries: ApexAxisChartSeries = [
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
        const year = selectedYear; // Ano selecionado
        const name = seriesIndex === 0 ? "normais" : "infrações";

        return /*html*/ `
          <div
            style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
          >
            <h1 style="font-weight: 500">${month} ${year}</h1>
            <p>Total de ${name}</p>
            <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
          </div>
        `;
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      const newSeries = [
        {
          name: "Caminhos normais",
          data: normalData,
        },
        {
          name: "Caminhos de despacho",
          data: defectiveData,
        },
      ];

      // Atualize os dados do gráfico sem re-renderizar o componente
      chartRef.current.updateSeries(newSeries);
    }
  }, [paths, defectivePaths]);

  return (
    <div>
      {/* Seletor de ano */}
      <div className="child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end mr-2 mt-1">
        <label htmlFor="year-select">Ano: </label>
        <select
          id="year-select"
          value={selectedYear}
          className=" rounded-md border border-gray-500 hover:cursor-pointer"
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {/* Exemplo: opções de anos de 2020 a 2030 */}
          {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico */}
      <Chart
        height={177}
        options={options}
        series={initialSeries}
        type="line"
        ref={chartRef} // Passe a referência para o gráfico
      />
    </div>
  );
}
