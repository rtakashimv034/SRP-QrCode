import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import HistoryIcon from "@/assets/icons/Icon awesome-history.svg";
import ClockIcon from "@/assets/icons/Icon material-access-time.svg";
import ReportIcon from "@/assets/icons/Icon_simple_everplaces.svg";
import {
  DefectivePathsProps,
  DefectiveProductProps,
  PathsProps,
  SectorProps,
} from "@/types";
import { useEffect, useState } from "react";
import { OccurrenceCard } from "../cards/OccurrenceCard";
import { DefectiveProductsTable } from "../DefectiveProductsTable";
import { DefaultLayout } from "../layouts/DefaultLayout";

export function Reports() {
  const [sectors, setSectors] = useState<SectorProps[]>([]);
  const [paths, setPaths] = useState<PathsProps[]>([]);
  const [defectiveProducts, setDefectiveProducts] = useState<
    DefectiveProductProps[]
  >([]);
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
      console.error("Error fetch paths: ", error);
    }
  };

  const fetchDefectiveProducts = async () => {
    try {
      const { data, status } = await api.get<DefectiveProductProps[]>(
        "/defective-products"
      );
      if (status === 200) {
        setDefectiveProducts(data);
      }
    } catch (error) {
      console.error("Error fetch products: ", error);
    }
  };

  // Escuta eventos do Socket.IO para atualização em tempo real
  useEffect(() => {
    socket.on("create-path", (newPath: PathsProps) => {
      setPaths((prev) => [...prev, newPath]);
    });
    socket.on("create-defective-path", (newDefPath: DefectivePathsProps) => {
      setDefectivePaths((prev) => [...prev, newDefPath]);
      setDefectiveProducts((prev) => {
        if (newDefPath.defectiveProduct) {
          const existingProductIndex = prev.findIndex(
            (p) => p.id === newDefPath.defProdId
          );
          // Se o produto já existe, atualize-o
          if (existingProductIndex !== -1) {
            const updatedProducts = [...prev];
            updatedProducts[existingProductIndex] = newDefPath.defectiveProduct;
            return updatedProducts;
          } else {
            return [...prev, newDefPath.defectiveProduct];
          }
        } else {
          return [...prev];
        }
      });
    });
    socket.on("create-sector", (sector: SectorProps) => {
      setSectors((prev) => [...prev, sector]);
    });
    socket.on("update-sector", (updatedSector: SectorProps) => {
      setSectors((prev) =>
        prev.map((sector) =>
          sector.name === updatedSector.name ? updatedSector : sector
        )
      );
    });
    socket.on("delete-sector", (sector: SectorProps) => {
      setSectors((prev) => prev.filter((s) => s.name !== sector.name));
    });
    // Limpa os listeners ao desmontar o componente
    return () => {
      socket.off("create-path");
      socket.off("create-defective-path");
      socket.off("create-sector");
      socket.off("update-sector");
      socket.off("delete-sector");
    };
  }, []);

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
            <DefectiveProductsTable products={defectiveProducts} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
