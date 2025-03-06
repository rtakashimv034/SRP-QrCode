import { api } from "@/api";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { SectorCard, SectorProps } from "../SectorCard";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"; // Importe os componentes do Dialog do Chadcn UI
import { Label } from "../ui/label";
import { LocalWorkstationProps, WorkstationCard } from "../WorkstationCard";

export function CreateSector() {
  const [sectorName, setSectorName] = useState("");
  const [stations, setStations] = useState<LocalWorkstationProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

  const navigate = useNavigate();

  const invalidSectorName =
    sectorName
      .split("")
      .filter((e) => e.trim().length)
      .join("").length < 3;

  const isDisabled = invalidSectorName || stations.length < 3;

  const handleAddingStation = () => {
    const newStation: LocalWorkstationProps = {
      description: "",
      localId: uuidv4(),
    };
    setStations([...stations, newStation]);
  };

  const handleDeleteStation = (id: string) => {
    const updateStations = stations.filter((station) => station.localId !== id);
    setStations(updateStations);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data: SectorProps = {
        name: sectorName,
        workstations: stations,
      };
      const res = await api.post("/sectors", data);
      if (res.status === 201) {
        setIsModalOpen(true);
        setSectorName("");
        setStations([]);
      }
    } catch (error) {
      alert(`could not create sector: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fecha o modal
    navigate(-1); // Redireciona para a página anterior
  };

  return (
    <DefaultLayout>
      <div className="flex flex-row items-center justify-start gap-2">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="size-7 text-black hover:cursor-pointer"
        />
        <h1 className="text-2xl font-bold whitespace-nowrap">
          Cadastrar Setor
        </h1>
      </div>
      <div className="flex-1 grid grid-cols-[55%_45%]">
        <div className="flex-1 flex justify-center items-center pr-4">
          <div className="rounded-xl child:px-4 w-full h-96 overflow-hidden border-2 flex flex-col border-green-light">
            <div className="bg-green-light shrink-0 flex items-center w-full h-10">
              <h1 className="text-white font-semibold text-lg">
                Dados do setor
              </h1>
            </div>
            <div className="flex-1 flex justify-evenly flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label className="font-normal text-base">Nome do Setor</Label>
                <input
                  type="text"
                  placeholder="Lorem Ipsum"
                  className="rounded-md w-full px-3 py-1 font-medium bg-gray-input placeholder:text-gray-placeholder placeholder:font-normal"
                  onChange={(e) => setSectorName(e.target.value)}
                  value={sectorName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-base">Estações</Label>
                  <div className="flex flex-col h-40 overflow-y-auto custom-scrollbar">
                    {stations.map((station, i) => (
                      <WorkstationCard
                        key={station.localId}
                        station={station}
                        isLatest={i === stations.length - 1}
                        onDelete={() => handleDeleteStation(station.localId)}
                      />
                    ))}
                  </div>
                </div>
                <button
                  className="rounded-md py-2 text-xs child:text-gray-dark hover:brightness-90 transition-all gap-2 w-full flex flex-row items-center justify-center font-normal bg-gray-input"
                  onClick={handleAddingStation}
                >
                  <CirclePlus className="size-4" />
                  <span>Adicionar estação</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center pl-4">
          <div className="w-full h-full max-h-96 flex flex-col justify-center items-center">
            <div className="flex flex-col h-full w-full border-2 rounded-lg border-green-light max-h-80 py-2 px-4">
              <h1 className="flex font-bold text-xl">Visualização:</h1>
              <div className="flex-1 flex justify-center items-center px-8">
                <SectorCard
                  disabled={true}
                  name={sectorName}
                  workstations={stations}
                />
              </div>
            </div>
            <div className="flex justify-center items-center h-52">
              <Button
                disabled={isDisabled || isLoading}
                variant={"submit"}
                onClick={handleSubmit}
              >
                {isLoading ? "Salvando..." : "Salvar Setor"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setor Criado com Sucesso!</DialogTitle>
            <DialogDescription>
              O setor "{sectorName}"" foi cadastrado com sucesso. Clique em
              "Fechar" para voltar à lista de setores.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"destructive"} onClick={handleCloseModal}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
}
