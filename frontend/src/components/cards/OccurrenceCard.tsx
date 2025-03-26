import { DefectivePathsProps, PathsProps, SectorProps } from "@/types";
import { Schedule } from "@/utils/schedule";
import { ChevronDown } from "lucide-react"; // Importe o ícone de seta
import { useState } from "react";
import { SectorOccurrenceChart } from "../charts/SectorOccurrenceChart";
import { TimeOccurrenceChart } from "../charts/TimeOccurrenceChart";

type ChartData = {
  paths: PathsProps[];
  sectors: SectorProps[];
  defectivePaths: DefectivePathsProps[];
};

type Props = {
  type: "sector" | "time";
  icon: string;
  data: ChartData;
};

export function OccurrenceCard({ icon, type, data }: Props) {
  const [schedule, setSchedule] = useState<Schedule>("Diário");

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
          )}
          {/* <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
            <FileChartPie className="text-gray-700 mr-1" size={15} />
            Gerar Relatório
          </Button> */}
        </div>
      </header>
      {/* Gráfico */}
      <div className="border border-gray-900 relative rounded-lg">
        {type === "sector" ? (
          <SectorOccurrenceChart sectors={data.sectors} />
        ) : (
          <TimeOccurrenceChart
            schedule={schedule}
            paths={data.paths}
            defectivePaths={data.defectivePaths}
          />
        )}
      </div>
    </div>
  );
}
