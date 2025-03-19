import { Sector } from "@/types/sectors";
import { ChevronDown, FileChartPie } from "lucide-react"; // Importe o ícone de seta
import { useState } from "react";
import { MonthOccurrenceChart } from "../charts/MonthOccurrenceChart";
import { SectorOccurrenceChart } from "../charts/SectorOccurrenceChart";
import { DefectivePathsProps, PathsProps } from "../pages/Reports";
import { Button } from "../ui/button";

type ChartData = {
  paths: PathsProps[];
  sectors: Sector[];
  defectivePaths: DefectivePathsProps[];
};

type Props = {
  type: "sector" | "time";
  icon: string;
  data: ChartData;
};

export function OccurrenceCard({ icon, type, data }: Props) {
  const [time, setTime] = useState("Mensal");

  return (
    <div className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-2">
        <img src={icon} alt="ReportIcon" className="w-5 h-5" />
        <h1 className="flex-grow text-2xl font-bold">
          Ocorrência por {type === "sector" ? "setor" : "tempo"}
        </h1>
        <div className="flex gap-8 justify-end flex-row items-center">
          {type === "time" && (
            <div className="flex flex-row items-center gap-2">
              <label className="text-xs">{time}</label>
              <div className="relative flex flex-row items-center">
                <select
                  className="border border-black hover:cursor-pointer hover:brightness-95 transition-all rounded-md size-5 child:text-xs appearance-none p-2" // Remova a aparência padrão e adicione padding à direita
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
                <div className="absolute flex justify-center right-[2px] top-[3px] items-center pointer-events-none">
                  <ChevronDown className="size-4" />
                </div>
              </div>
            </div>
          )}
          <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
            <FileChartPie className="text-gray-700 mr-1" size={15} />
            Gerar Relatório
          </Button>
        </div>
      </header>
      {/* Gráfico */}
      <div className="border border-gray-900 rounded-lg">
        {type === "sector" ? (
          <SectorOccurrenceChart sectors={data.sectors} />
        ) : (
          <MonthOccurrenceChart
            paths={data.paths}
            defectivePaths={data.defectivePaths}
          />
        )}
      </div>
    </div>
  );
}
