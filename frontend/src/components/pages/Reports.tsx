import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import HistoryIcon from "@/assets/icons/Icon awesome-history.svg";
import ClockIcon from "@/assets/icons/Icon material-access-time.svg";
import ReportIcon from "@/assets/icons/Icon_simple_everplaces.svg";
import { useAuth } from "@/hooks/useAuth";
import { useCache } from "@/hooks/useCache";
import {
  DefectivePathsProps,
  DefectiveProductProps,
  PathsProps,
  SectorProps,
} from "@/types";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { OccurrenceCard } from "../cards/OccurrenceCard";
import { DefectiveProductsTable } from "../DefectiveProductsTable";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

let inMemoryDefectiveProducts: DefectiveProductProps[] | null = null;

export function Reports() {
  const [sectors, setSectors] = useState<SectorProps[]>([]);
  const [paths, setPaths] = useState<PathsProps[]>([]);
  const [defectiveProducts, setDefectiveProducts] = useState<
    DefectiveProductProps[]
  >([]);
  const [defectivePaths, setDefectivePaths] = useState<DefectivePathsProps[]>(
    []
  );
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isErrorDeletion, setIsErrorDeletion] = useState(false);
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);

  const { user } = useAuth();

  const { clearCache, getCache, setCache } = useCache<DefectiveProductProps[]>({
    key: "defective-products",
    expirationTime: 1,
  });

  const myHeight = window.innerHeight;

  const handleDeleteInfractions = async () => {
    try {
      setIsDeletionLoading(true);
      const { status } = await api.delete("/defective-products");
      if (status === 204) {
        setIsClearModalOpen(false);
        fetchDefectiveProducts();
        toast.success("Infrações excluídas com sucesso!");
      }
    } catch (error) {
      setIsErrorDeletion(true);
      console.log("erro ao deletar infrações: " + error);
    } finally {
      setIsDeletionLoading(false);
    }
  };

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
      if (inMemoryDefectiveProducts) {
        setDefectiveProducts(inMemoryDefectiveProducts);
      }
      const cachedProducts = getCache();
      if (cachedProducts) {
        setDefectiveProducts(cachedProducts);
        inMemoryDefectiveProducts = cachedProducts;
      }
      const { data, status } = await api.get<DefectiveProductProps[]>(
        "/defective-products"
      );
      if (status === 200) {
        setDefectiveProducts(data);
        clearCache();
        if (data.length > 0) {
          inMemoryDefectiveProducts = data;
          setCache(data);
        }
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
    socket.on("delete-products", () => {
      setPaths([]);
      setSectors((prev) => prev.map((s) => ({ ...s, paths: [] })));
    });
    socket.on("delete-defective-products", () => {
      setDefectivePaths([]);
      setDefectiveProducts([]);
      setSectors((prev) => prev.map((s) => ({ ...s, defectivePaths: [] })));
    });
    // Limpa os listeners ao desmontar o componente
    return () => {
      socket.off("create-path");
      socket.off("create-defective-path");
      socket.off("create-sector");
      socket.off("update-sector");
      socket.off("delete-sector");
      socket.off("delete-products");
      socket.off("delete-defective-products");
    };
  }, []);

  useEffect(() => {
    fetchSectors();
    fetchAllPaths();
    fetchDefectiveProducts();
  }, []);

  return (
    <>
      <DefaultLayout>
        <div className="flex flex-row h-full gap-7">
          {/* Seção de Ocorrências */}
          <div
            className={`flex flex-col flex-grow h-full w-[60%] ${
              myHeight < 700 && "overflow-y-auto"
            } gap-3`}
          >
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
            <div className="flex items-center gap-2">
              <img
                src={HistoryIcon}
                alt="HistoryIcon"
                className="w-5 h-5 my-auto"
              />
              <h1 className="flex-grow text-2xl font-bold">
                Histórico de Infrações
              </h1>
              {user?.email === "admin@gmail.com" &&
                user.isManager &&
                defectiveProducts.length > 0 && (
                  <button
                    className="hover:brightness-150 p-1.5 rounded-lg border-2 border-red-700"
                    title="Apagar tudo"
                    onClick={() => setIsClearModalOpen(true)}
                  >
                    <Trash2 className="size-4 text-red-700" />
                  </button>
                )}
            </div>

            {/* Tabela de Histórico */}
            <div className="overflow-x-auto">
              <DefectiveProductsTable products={defectiveProducts} />
            </div>
          </div>
        </div>
      </DefaultLayout>
      <Dialog
        open={isClearModalOpen}
        onOpenChange={() => {
          setIsClearModalOpen(false);
          setIsErrorDeletion(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isErrorDeletion
                ? "Falha ao tentar excluir infrações"
                : "Excluir tudo"}
            </DialogTitle>
            <DialogDescription>
              {isErrorDeletion
                ? "Não foi possível excluir as infrações do sistema (verifique a sua conexão ou tente mais tarde)."
                : "Você tem certeza que deseja excluir >>TODAS<< as ocorrências de produtos defeituosos e >>TODOS<< os seus respectivos caminhos do sistema inteiro? (após essa operação não será possível recuperar os dados!)"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              disabled={isDeletionLoading}
              onClick={handleDeleteInfractions}
            >
              {isDeletionLoading
                ? "Deletando..."
                : isErrorDeletion
                ? "Tentar novamente"
                : "Sim"}
            </Button>
            <Button
              variant={"default"}
              onClick={() => {
                setIsClearModalOpen(false);
                setIsErrorDeletion(false);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
