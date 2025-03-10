import { api } from "@/api";
import { FileChartPie } from "lucide-react";
import { useEffect, useState } from "react";
import { OccurrenceChart } from "../OccurrenceChart";
import { Button } from "../ui/button";
import { WorkstationProps } from "./WorkstationCard";

export type PathsProps = {
  id: number;
  stationId: number;
  prodSN: string;
  sectorName: string;
  registeredAt: string;
};

export type DefectivePathsProps = {
  id: number;
  stationId: number;
  defProdId: number;
  sectorName: string;
  registeredAt: string;
};

export type SectorProps = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  workstations: WorkstationProps[];
  paths: PathsProps[];
  defectivePaths: DefectivePathsProps[];
};

type Props = {
  type: "sector" | "time";
  icon: string;
};

export function OccurrenceCard({ icon, type }: Props) {
  const [sectors, setSectors] = useState<SectorProps[]>([]);
  const [defectivePaths, setDefectivePaths] = useState<DefectivePathsProps[]>(
    []
  );

  const fetchSectors = async () => {
    try {
      const { data, status } = await api.get<SectorProps[]>("/sectors");
      if (status === 200) {
        console.log(data);
        setSectors(data);
      }
    } catch (error) {
      alert("Error fetch deferred paths: " + error);
      console.error("Error fetch defective paths: ", error);
    }
  };

  const fetchDefectivePaths = async () => {
    try {
      const { data, status } = await api.get<DefectivePathsProps[]>(
        "/defective-paths"
      );
      if (status === 200) {
        setDefectivePaths(data);
      }
    } catch (error) {
      alert("Error fetch deferred paths: " + error);
      console.error("Error fetch defective paths: ", error);
    }
  };

  useEffect(() => {
    if (type === "sector") {
      fetchSectors();
    } else {
      fetchDefectivePaths();
    }
  }, [type]);

  return (
    <div className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-2">
        <img src={icon} alt="ReportIcon" className="w-5 h-5 my-auto" />
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
          <OccurrenceChart
            categories={sectors.map(({ id }) => `#${id}`)}
            label={sectors.map(({ name }) => name)}
            data={sectors.map(({ defectivePaths }) => defectivePaths.length)}
          />
        ) : (
          <OccurrenceChart
            categories={sectors.map(({ id }) => `#${id}`)}
            data={sectors.map(({ defectivePaths }) => defectivePaths.length)}
            label={sectors.map(({ name }) => name)}
          />
        )}
      </div>
    </div>
  );
}
