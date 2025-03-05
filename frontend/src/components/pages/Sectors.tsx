import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCache } from "@/hooks/useCache";
import { Factory, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { SectorCard, SectorProps } from "../SectorCard";

type Props = SectorProps[];

export function Sectors() {
  const navigator = useNavigate();
  const [sectors, setSectors] = useState<Props>([]);
  const { getCache, setCache } = useCache<Props>({ key: "sectors-cache" });
  const [searchTerm, setSearchTerm] = useState("");

  const { isSupervisor } = useAuth();

  const fetchSectors = async () => {
    try {
      const cachedSectors = getCache();
      if (cachedSectors) {
        setSectors(cachedSectors);
        return;
      }
      // Se não tem cache ou está expirado, faz a requisição
      const { data, status } = await api.get<Props>("/sectors");
      if (status === 200) {
        setSectors(data);
        setCache(data);
      }
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      alert("Erro ao carregar setores");
    }
  };

  const filderedSectors = sectors.filter((s) =>
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
          {isSupervisor && (
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
            {filderedSectors.map(({ name, workstations }, index) => (
              <SectorCard name={name} workstations={workstations} key={index} />
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
