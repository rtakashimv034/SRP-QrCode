import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCache } from "@/hooks/useCache";
import { SectorProps } from "@/types";
import { Factory, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectorCard } from "../cards/SectorCard";
import { ErrorDialog } from "../ErrorDialog";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Loading } from "../Loading";
import { SectorModal } from "../SectorModal";

type Props = SectorProps[];

// Cache em memória para dados sensíveis
let inMemorySectorCache: Props | null = null;

export function Sectors() {
  const navigator = useNavigate();
  const [sectors, setSectors] = useState<Props>([]);
  const { getCache, setCache, clearCache } = useCache<Props>({
    key: "sectors-cache",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sector, setSector] = useState<SectorProps | null>(null);
  const { user } = useAuth();

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isErrorDeletion, setIsErrorDeletion] = useState(false);

  const fetchSectors = async () => {
    try {
      setIsPageLoading(true);
      // Verifica o cache em memória primeiro
      if (inMemorySectorCache) {
        setSectors(inMemorySectorCache);
      }
      // Verifica o cache no sessionStorage
      const cachedSectors = getCache();
      if (cachedSectors) {
        setSectors(cachedSectors);
        inMemorySectorCache = cachedSectors;
      }

      const { data, status } = await api.get<Props>("/sectors");
      if (status === 200) {
        setSectors(data);
        clearCache();
        if (data.length > 0) {
          setCache(data);
          inMemorySectorCache = data;
        }
      }
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleDeleteSector = async () => {
    if (!sector) return; // Verifica se há um setor para deletar

    try {
      setIsLoading(true);
      const { status } = await api.delete(`/sectors/${sector.name}`);
      if (status === 204) {
        setIsModalOpen(false); // Fecha o modal
        fetchSectors(); // Atualiza a lista de setores
      }
    } catch (error) {
      console.log("Erro ao deletar setor: " + error);
      setIsErrorDeletion(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSectors = sectors.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
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
      socket.off("create-defective-product");
      socket.off("create-sector");
      socket.off("update-sector");
      socket.off("delete-sector");
    };
  }, []);

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <>
      <DefaultLayout>
        <header className="grid grid-cols-[50%_50%] items-center justify-between">
          <div className="flex flex-row items-center gap-6">
            <div className="flex flex-row items-center gap-3">
              <Factory className="size-6 fill-black" />
              <h1 className="text-lg font-bold whitespace-nowrap">
                {user?.isManager ? "Painel de Setores" : "Linhas de Produção"}
              </h1>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {isPageLoading
                ? "Carregando..."
                : `${sectors.length} setores cadastrados.`}
            </p>
          </div>
          <div className="flex flex-row items-center gap-5">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder=" Buscar"
                className="pl-10 rounded-2xl bg-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {user?.isManager && (
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-2xl"
                onClick={() => navigator("create-sector")}
              >
                <Plus />
                <span>Adicionar Setor</span>
              </Button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-y-4 gap-x-3 py-4 w-full">
              {isPageLoading ? (
                <Loading amountCards={6} heightRem={28} />
              ) : (
                filteredSectors.map((data, index) => (
                  <SectorCard
                    key={index}
                    data={data}
                    onDelete={() => {
                      setSector(data); // Define o setor a ser deletado
                      setIsModalOpen(true); // Abre o modal
                    }}
                    onUpdate={() => {
                      setSector(data);
                      setIsEditModalOpen(true);
                    }}
                    onViewSector={() => {
                      setSector(data);
                      setIsViewModalOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
      {/* Delete Confirmation Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
          setIsErrorDeletion(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isErrorDeletion ? "Falha ao excluir setor" : "Excluir setor"}
            </DialogTitle>
            <DialogDescription>
              {isErrorDeletion
                ? "Ocorreu um erro ao tentar excluir o setor (verifique a sua conexão ou tente novamente mais tarde)."
                : `Você tem certeza que deseja excluir o setor "${sector?.name}"?
              (Suas respectivas estações também serão excluídas).`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={handleDeleteSector}
              disabled={isLoading}
            >
              {isErrorDeletion
                ? "Tentar novamente"
                : isLoading
                ? "Deletando..."
                : "Sim"}
            </Button>
            <Button variant={"default"} onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SectorModal
        mode="view"
        sector={sector}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        onDelete={() => {
          setSector(sector);
          setIsModalOpen(true);
        }}
      />

      <SectorModal
        mode="edit"
        sector={sector}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={fetchSectors}
      />

      <ErrorDialog
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        action="carrregar setores"
      />
    </>
  );
}
