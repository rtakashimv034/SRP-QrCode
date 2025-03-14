import { api } from "@/api";
import HistoryIcon from "@/assets/Icon awesome-history.svg";
import ClockIcon from "@/assets/Icon material-access-time.svg";
import ReportIcon from "@/assets/Icon_simple_everplaces.svg";
import { useEffect, useState } from "react";
import { OccurrenceCard } from "../cards/OccurrenceCard";
import { WorkstationProps } from "../cards/WorkstationCard";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { DefectiveProductProps, ProductsTable } from "../ProductsTable";

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

export function Reports() {
  const [sectors, setSectors] = useState<SectorProps[]>([]);
  const [paths, setPaths] = useState<PathsProps[]>([]);
  const [products, setProducts] = useState<DefectiveProductProps[]>([]);
  const [defectivePaths, setDefectivePaths] = useState<DefectivePathsProps[]>(
    []
  );

  const fetchSectors = async () => {
    try {
      const { data, status } = await api.get<SectorProps[]>("/sectors");
      if (status === 200) {
        setSectors(data);
      }
    } catch (error) {
      alert("Error fetch deferred paths: " + error);
      console.error("Error fetch defective paths: ", error);
    }
  };

  const fetchAllPaths = async () => {
    try {
      const defPathsRes = await api.get<DefectivePathsProps[]>(
        "/defective-paths"
      );
      if (defPathsRes.status === 200) {
        setDefectivePaths(defPathsRes.data);
      }
      const pathsRes = await api.get<PathsProps[]>("/paths");
      if (pathsRes.status === 200) {
        setPaths(pathsRes.data);
      }
    } catch (error) {
      alert("Error fetching paths: " + error);
      console.error("Error fetch paths: ", error);
    }
  };

  const fetchDefectiveProducts = async () => {
    try {
      const { data, status } = await api.get<DefectiveProductProps[]>(
        "/defective-products"
      );
      if (status === 200) {
        setProducts(data);
      }
    } catch (error) {
      alert("Error fetching products: " + error);
      console.error("Error fetch products: ", error);
    }
  };

  useEffect(() => {
    fetchSectors();
    fetchAllPaths();
    fetchDefectiveProducts();
  }, []);

  return (
    <DefaultLayout>
      <div className="flex flex-row h-full gap-7">
        {/* Seção de Ocorrências */}
        <div className="flex flex-col flex-grow h-full w-[60%] gap-3">
          <OccurrenceCard
            data={{ defectivePaths, paths, sectors }}
            type="sector"
            icon={ReportIcon}
          />
          <OccurrenceCard
            data={{ defectivePaths, paths, sectors }}
            type="time"
            icon={ClockIcon}
          />
        </div>

        {/* Seção de Histórico de Infrações */}
        <div className="flex flex-col flex-grow w-[40%] gap-5 pb-2.5">
          <header className="flex items-center gap-2">
            <img
              src={HistoryIcon}
              alt="HistoryIcon"
              className="w-5 h-5 my-auto"
            />
            <h1 className="flex-grow text-2xl font-bold">
              Histórico de Infrações
            </h1>
          </header>

          {/* Tabela de Histórico */}
          <div className="overflow-x-auto">
            <ProductsTable data={products} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
