import { api } from "@/api";
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
import { Factory, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { CreationSectorProps, SectorCard } from "../SectorCard";

type Props = CreationSectorProps[];

export function Sectors() {
  const navigator = useNavigate();
  const [sectors, setSectors] = useState<Props>([]);
  const { getCache, setCache } = useCache<Props>({ key: "sectors-cache" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectorName, setSectorName] = useState<string | null>(null); // Armazena o nome do setor a ser deletado
  const { isManager } = useAuth();

  const fetchSectors = async () => {
    try {
      const { data, status } = await api.get<Props>("/sectors");
      if (status === 200) {
        setSectors(data);
        setCache(data);
      }

      const cachedSectors = getCache();
      if (cachedSectors) {
        setSectors(cachedSectors);
      }
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      alert("Erro ao carregar setores");
    }
  };

  const handleDeleteSector = async () => {
    if (!sectorName) return; // Verifica se há um setor para deletar

    try {
      setIsLoading(true);
      const { status } = await api.delete(`/sectors/${sectorName}`);
      if (status === 204) {
        setIsModalOpen(false); // Fecha o modal
        fetchSectors(); // Atualiza a lista de setores
      }
    } catch (error) {
      alert("Erro ao deletar setor");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (name: string) => {
    navigator(`edit-sector/${name}`);
  };

  const filteredSectors = sectors.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <DefaultLayout>
      <header className="grid grid-cols-[50%_50%] items-center justify-between">
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-row items-center gap-3">
            <Factory className="size-6 fill-black" />
            <h1 className="text-lg font-bold whitespace-nowrap">
              Painel de Setores
            </h1>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {sectors.length} setores cadastrados.
          </p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder=" Buscar"
              className="pl-10 rounded-2xl bg-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isManager && (
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
            {filteredSectors.map((data, index) => (
              <SectorCard
                data={data}
                key={index}
                onDelete={() => {
                  setSectorName(data.name); // Define o setor a ser deletado
                  setIsModalOpen(true); // Abre o modal
                }}
                onUpdate={() => handleUpdate(data.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Setor</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar o Setor "{sectorName}"? (Suas
              respectivas estações também serão excluídas).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={handleDeleteSector}
              disabled={isLoading}
            >
              {isLoading ? "Deletando..." : "Sim"}
            </Button>
            <Button variant={"default"} onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
}
