import { FileChartPie } from "lucide-react";
import { DefectivePathsProps, PathsProps, SectorProps } from "../pages/Reports";
import { SectorOccurrenceChart } from "../SectorOccurrenceChart";
import { TimeOccurrenceChart } from "../TimeOccurrenceChart";
import { Button } from "../ui/button";

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
  return (
    <div className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-2">
        <img src={icon} alt="ReportIcon" className="w-5 h-5" />
        <h1 className="flex-grow text-2xl font-bold">
          Ocorrência por {type === "sector" ? "setor" : "tempo"}
        </h1>
        <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
          <FileChartPie className="text-gray-700 mr-1" size={15} />
          Gerar Relatório
        </Button>
      </header>
      {/* Gráfico */}
      <div className="border border-gray-900 rounded-lg">
        {type === "sector" ? (
          <SectorOccurrenceChart sectors={data.sectors} />
        ) : (
          <TimeOccurrenceChart
            paths={data.paths}
            defectivePaths={data.defectivePaths}
          />
        )}
      </div>
    </div>
  );
}
