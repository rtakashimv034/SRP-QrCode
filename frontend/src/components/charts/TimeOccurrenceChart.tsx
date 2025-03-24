import { DefectivePathsProps } from "@/types/defectivePaths";
import { PathsProps } from "@/types/paths";
import { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { Schedule } from "../cards/OccurrenceCard";

type Props = {
  paths: PathsProps[] | [];
  defectivePaths: DefectivePathsProps[] | [];
  schedule: Schedule;
};

export function TimeOccurrenceChart({
  paths,
  defectivePaths,
  schedule,
}: Props) {
  const chartRef = useRef<Chart | null>(null);

  // Estado para armazenar o ano selecionado pelo usuário
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Estado para armazenar o mês selecionado pelo usuário (apenas para o modo diário)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual (1 a 12)

  // Função para agrupar e acumular ocorrências por mês, mantendo o dia e o horário da ocorrência
  const groupByMonthWithDayAndTime = (
    data: (PathsProps | DefectivePathsProps)[]
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

  const currentYear = new Date().getFullYear();

  const pathsYear = paths
    .map((item) => new Date(item.registeredAt).getFullYear())
    .sort((a, b) => a - b);
  const firstPathsYear = pathsYear[0] || currentYear;
  const lastPathsYear = pathsYear.pop() || currentYear;

  const defectivePathsYear = defectivePaths
    .map((item) => new Date(item.registeredAt).getFullYear())
    .sort((a, b) => a - b);
  const firstDefectivePathsYear = defectivePathsYear[0] || currentYear;
  const lastDefectivePathsYear = pathsYear.pop() || currentYear;

  const startYear =
    [firstPathsYear, firstDefectivePathsYear].sort((a, b) => a - b)[0] ||
    currentYear;

  const endYear =
    [lastDefectivePathsYear, lastPathsYear].sort((a, b) => a - b).pop() ||
    currentYear;

  // Função para agrupar e acumular ocorrências por ano
  const groupByYear = (data: (PathsProps | DefectivePathsProps)[]) => {
    const grouped: { [key: string]: number } = {};

    data.forEach((item) => {
      const year = new Date(item.registeredAt).getFullYear().toString(); // Extrai o ano
      if (!grouped[year]) {
        grouped[year] = 0;
      }
      grouped[year]++;
    });

    return grouped;
  };

  // Função para agrupar e acumular ocorrências por dia
  const groupByDay = (
    data: (PathsProps | DefectivePathsProps)[],
    year: number,
    month: number
  ) => {
    const grouped: { [key: string]: number } = {};

    data.forEach((item) => {
      const date = new Date(item.registeredAt);
      const itemYear = date.getFullYear();
      const itemMonth = date.getMonth() + 1;
      const day = date.getDate(); // Extrai o dia (1 a 31)

      if (itemYear === year && itemMonth === month) {
        if (!grouped[day]) {
          grouped[day] = 0;
        }
        grouped[day]++;
      }
    });

    return grouped;
  };

  // Filtra os dados para o ano selecionado
  const filterDataByYear = <T extends PathsProps | DefectivePathsProps>(
    data: T[],
    year: number
  ) => {
    return data.filter((item) => {
      const itemYear = new Date(item.registeredAt).getFullYear();
      return itemYear === year;
    });
  };

  // Filtra os dados para o ano e mês selecionados (apenas para o modo diário)
  const filterDataByYearAndMonth = <T extends PathsProps | DefectivePathsProps>(
    data: T[],
    year: number,
    month: number
  ) => {
    return data.filter((item) => {
      const date = new Date(item.registeredAt);
      const itemYear = date.getFullYear();
      const itemMonth = date.getMonth() + 1;
      return itemYear === year && itemMonth === month;
    });
  };

  // Dados filtrados com base no tipo de visualização
  let filteredPaths: PathsProps[] = [];
  let filteredDefectivePaths: DefectivePathsProps[] = [];

  if (schedule === "Anual") {
    // Para o modo anual, exibe dados de 2025 a 2035
    filteredPaths = paths.filter((item) => {
      return new Date(item.registeredAt).getFullYear();
    });
    filteredDefectivePaths = defectivePaths.filter((item) => {
      return new Date(item.registeredAt).getFullYear();
    });
  } else if (schedule === "Mensal") {
    // Para o modo mensal, filtra pelo ano selecionado
    filteredPaths = filterDataByYear(paths, selectedYear);
    filteredDefectivePaths = filterDataByYear(defectivePaths, selectedYear);
  } else {
    // Para o modo diário, filtra pelo ano e mês selecionados
    filteredPaths = filterDataByYearAndMonth(
      paths,
      selectedYear,
      selectedMonth
    );
    filteredDefectivePaths = filterDataByYearAndMonth(
      defectivePaths,
      selectedYear,
      selectedMonth
    );
  }

  // Agrupa e acumula ocorrências normais e defeituosas por ano (apenas para o modo anual)
  const normalGroupedByYear = groupByYear(filteredPaths);
  const defectiveGroupedByYear = groupByYear(filteredDefectivePaths);

  // Agrupa e acumula ocorrências normais e defeituosas por mês (apenas para o modo mensal)
  const normalGroupedByMonth = groupByMonthWithDayAndTime(filteredPaths);
  const defectiveGroupedByMonth = groupByMonthWithDayAndTime(
    filteredDefectivePaths
  );

  // Agrupa e acumula ocorrências normais e defeituosas por dia (apenas para o modo diário)
  const normalGroupedByDay = groupByDay(
    filteredPaths,
    selectedYear,
    selectedMonth
  );
  const defectiveGroupedByDay = groupByDay(
    filteredDefectivePaths,
    selectedYear,
    selectedMonth
  );

  // Cria uma lista completa de anos (2025 a 2035)
  const allYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ); // Anos de 2025 a 2035

  // Cria uma lista completa de meses do ano (de janeiro a dezembro)
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0"); // Formata o mês (ex: "01" para janeiro)
    return `${selectedYear}-${month}`; // Formato: "YYYY-MM"
  });

  // Cria uma lista completa de dias do mês (1 a 31)
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Número de dias no mês
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Dias de 1 a 31

  // Prepara os dados para o gráfico, preenchendo com 0 para anos, meses ou dias sem registros
  const normalData =
    schedule === "Anual"
      ? allYears.map((year) => normalGroupedByYear[year.toString()] || 0)
      : schedule === "Diário"
      ? allDays.map((day) => normalGroupedByDay[day] || 0)
      : allMonths.map((month) => normalGroupedByMonth[month]?.count || 0);
  const defectiveData =
    schedule === "Anual"
      ? allYears.map((year) => defectiveGroupedByYear[year.toString()] || 0)
      : schedule === "Diário"
      ? allDays.map((day) => defectiveGroupedByDay[day] || 0)
      : allMonths.map((month) => defectiveGroupedByMonth[month]?.count || 0);

  // Nomes dos anos para o eixo X (modo anual)
  const yearNames = allYears.map((year) => year.toString());

  // Nomes dos meses para o eixo X (modo mensal)
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

  // Nomes dos dias para o eixo X (modo diário)
  const dayNames = allDays.map((day) => day.toString());

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
      // Exibe markers apenas nos anos, meses ou dias que possuem dados
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
      categories:
        schedule === "Anual"
          ? yearNames
          : schedule === "Diário"
          ? dayNames
          : monthNames, // Usa os nomes dos anos, dias ou meses como categorias
      labels: {
        formatter: (value) => value, // Exibe os nomes dos anos, dias ou meses diretamente
      },
      tickAmount:
        schedule === "Anual" ? 11 : schedule === "Diário" ? daysInMonth : 12, // Força a exibição de 11 anos, 12 meses ou dias no mês
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
        const name = seriesIndex === 0 ? "normais" : "infrações";

        if (schedule === "Anual") {
          const year = yearNames[dataPointIndex]; // Ano selecionado
          return /*html*/ `
            <div
              style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
            >
              <h1 style="font-weight: 500">${year}</h1>
              <p>Total de ${name}</p>
              <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
            </div>
          `;
        } else if (schedule === "Diário") {
          const day = dayNames[dataPointIndex]; // Dia selecionado
          const month = monthNames[selectedMonth - 1]; // Mês selecionado
          const year = selectedYear; // Ano selecionado
          return /*html*/ `
            <div
              style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
            >
              <h1 style="font-weight: 500">${day} ${month} ${year}</h1>
              <p>Total de ${name}</p>
              <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
            </div>
          `;
        } else {
          const month = monthNames[dataPointIndex]; // Nome do mês
          const year = selectedYear; // Ano selecionado
          return /*html*/ `
            <div
              style="background: #d4d4d46d; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); text-align: center; "
            >
              <h1 style="font-weight: 500">${month} ${year}</h1>
              <p>Total de ${name}</p>
              <strong style="font-weight: 700; font-size: 1.25rem;">${value}</strong>
            </div>
          `;
        }
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
  }, [paths, defectivePaths, normalData, defectiveData, schedule]);

  return (
    <div>
      {/* Seletor de ano (apenas para os modos mensal e diário) */}
      {schedule !== "Anual" && (
        <div className="child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end mr-2 mt-1">
          <label htmlFor="year-select">Ano: </label>
          <select
            id="year-select"
            value={selectedYear}
            className="rounded-md border border-gray-500 hover:cursor-pointer"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {/* Exemplo: opções de anos de 2025 a 2035 */}
            {Array.from(
              { length: endYear - startYear + 1 },
              (_, i) => startYear + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Seletor de mês (apenas para o modo diário) */}
      {schedule === "Diário" && (
        <div className="absolute top-0 right-24 child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end mr-2 mt-1">
          <label htmlFor="month-select">Mês: </label>
          <select
            id="month-select"
            value={selectedMonth}
            className="rounded-md border border-gray-500 hover:cursor-pointer"
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {/* Opções de meses de 1 a 12 */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {monthNames[month - 1]}
              </option>
            ))}
          </select>
        </div>
      )}

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
