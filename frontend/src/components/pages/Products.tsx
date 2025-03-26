import { ProductProps } from "@/types/products";
import { Box, ChevronDown, FileChartPie, Search } from "lucide-react";
import { useState } from "react";
import { Schedule } from "../cards/OccurrenceCard";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

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

const years = [
  2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033,
];

const monthsMap = new Map<string, number>();

monthNames.forEach((month, index) => {
  monthsMap.set(month, index + 1);
});

const startYear = years[0];
const endYear = years[years.length - 1];

export function Products() {
  const [products, setProducts] = useState<ProductProps[]>();
  const [schedule, setSchedule] = useState<Schedule>("Diário");
  const [month, setMonth] = useState<string>("Jan");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <DefaultLayout>
      <header className="grid grid-cols-[40%_60%] pb-3 items-center justify-between">
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-row items-center gap-2">
            <Box className="size-8 fill-black text-white" />
            <h1 className="text-lg font-bold whitespace-nowrap">
              Painel de Produtos
            </h1>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {12} produtos filtrados.
          </p>
        </div>
        <div className="flex w-full flex-row items-center gap-5 justify-end">
          <div className="flex flex-row items-center gap-2">
            {schedule === "Diário" && (
              <>
                <div className="relative w-full max-w-36">
                  <Search
                    className="absolute left-2.5 top-1.5 text-gray-400"
                    size={16}
                  />
                  <Input
                    type="number"
                    placeholder="Buscar por dia"
                    className="pl-8 rounded-xl h-7 no-spinner border border-gray-500"
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="right-24 child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end">
                  <label htmlFor="month-select">Mês: </label>
                  <select
                    id="month-select"
                    value={month}
                    className="rounded-md border border-gray-500 hover:cursor-pointer"
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {Array.from(
                      { length: monthNames.length },
                      (_, i) => i + 1
                    ).map((monthIndex) => (
                      <option
                        key={monthIndex}
                        value={monthNames[monthIndex - 1]}
                      >
                        {monthNames[monthIndex - 1]}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {schedule !== "Anual" && (
              <div className="flex flex-row items-center gap-2">
                <div className="right-24 child:text-sm child:opacity-70 flex flex-row items-center gap-2 justify-end">
                  <label htmlFor="month-select">Ano: </label>
                  <select
                    id="year-select"
                    value={year}
                    className="rounded-md border border-gray-500 hover:cursor-pointer"
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
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
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <label className="text-sm font-medium">{schedule}</label>
              <div className="relative flex flex-row items-center">
                <select
                  className="border border-black hover:cursor-pointer hover:brightness-95 transition-all rounded-md size-5 child:text-sm appearance-none p-2"
                  onChange={(e) => setSchedule(e.target.value as Schedule)}
                >
                  <option value="Diário">Diário</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Anual">Anual</option>
                </select>
                <div className="absolute flex justify-center right-[2px] top-[3px] items-center pointer-events-none">
                  <ChevronDown className="size-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-40">
            <Search className="absolute left-3 top-2 text-gray-400" size={20} />
            <Input
              type="number"
              placeholder="Buscar por ID"
              className="pl-10 rounded-2xl bg-gray-100 no-spinner"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <div className=" h-full overflow-y-auto no-scrollbar">
          <div className="flex flex-1 px-10 py-3 flex-col items-center gap-4">
            {Array.from({ length: 20 }).map(() => (
              <Card className="bg-gray-card overflow-hidden rounded-xl h-14 shadow-md w-full flex border-none">
                <div className="bg-green-light shrink-0 w-4" />
                <CardContent className="flex flex-row w-full p-2 justify-between">
                  <div className="flex flex-col justify-center items-start">
                    <h1 className="font-semibold text-xl">PDT-12</h1>
                    <span className="text-xs opacity-50">
                      Registrado no dia 8 às 13:45
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <Button
                      className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-gray-default transition-all"
                      onClick={() => {}}
                    >
                      <FileChartPie className="text-gray-700" size={15} />
                      Gerar Relatório
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
