import { api } from "@/api";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CreationSectorProps, SectorCard } from "../cards/SectorCard";
import {
  CreationWorkstationProps,
  LocalWorkstationProps,
  WorkstationCard,
  WorkstationProps,
} from "../cards/WorkstationCard";
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
import { Label } from "../ui/label";

export function EditSector() {
  const { name } = useParams<{ name: string }>(); // Acessa o nome do setor da rota
  const [sectorName, setSectorName] = useState("");
  const [localWorkstations, setLocalWorkstations] = useState<
    LocalWorkstationProps[]
  >([]);
  const [workstations, setWorkstations] = useState<CreationWorkstationProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSectorData = async () => {
    try {
      const { data, status } = await api.get<CreationSectorProps>(
        `/sectors/${name}`
      );
      if (status === 200) {
        setSectorName(data.name);
        const localStations: LocalWorkstationProps[] = data.workstations.map(
          (station) => ({
            name: station.name,
            localId: uuidv4(),
          })
        );
        setLocalWorkstations(localStations);
        setWorkstations(data.workstations);
      }
    } catch (error) {
      console.error("Erro ao carregar setor:", error);
      alert("Erro ao carregar setor");
    }
  };

  const invalidSectorName =
    sectorName
      .split("")
      .filter((e) => e.trim().length)
      .join("").length < 3;

  const isDisabled = invalidSectorName || workstations.length < 3;

  const handleAddingStation = () => {
    const newStation: LocalWorkstationProps = {
      name: "",
      localId: uuidv4(),
    };
    setLocalWorkstations([...localWorkstations, newStation]);
  };

  const handleDeleteStation = (id: string) => {
    const updatedStations = localWorkstations.filter(
      (station) => station.localId !== id
    );
    setLocalWorkstations(updatedStations);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Convert localWorkstations to WorkstationProps
      const workstationsForApi: WorkstationProps[] = localWorkstations.map(
        (station) => ({
          sectorName: sectorName,
          name: station.name,
        })
      );

      const data: CreationSectorProps = {
        name: sectorName,
        workstations: workstationsForApi,
      };
      const res = await api.patch(`/sectors/${name}`, data); // Atualiza o setor
      if (res.status === 200) {
        setIsModalOpen(true);
      }
    } catch (error) {
      alert(`Erro ao atualizar setor: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (id: string, name: string) => {
    const updatedStations = localWorkstations.map((station) =>
      station.localId === id ? { ...station, name } : station
    );
    setLocalWorkstations(updatedStations); // Update localWorkstations state
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/sectors"); // Redireciona para a lista de setores
  };

  useEffect(() => {
    fetchSectorData();
  }, []);

  return (
    <DefaultLayout>
      <div className="flex flex-row items-center justify-start gap-2">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="size-7 text-black hover:cursor-pointer"
        />
        <h1 className="text-2xl font-bold whitespace-nowrap">Editar Setor</h1>
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
                    {localWorkstations.map((station, i) => (
                      <WorkstationCard
                        key={station.localId}
                        station={station}
                        isLatest={i === workstations.length - 1}
                        onDelete={() => handleDeleteStation(station.localId)}
                        name={station.name}
                        onNameChange={handleNameChange}
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
                  data={{
                    name: sectorName,
                    workstations: localWorkstations.map(({ name }) => ({
                      sectorName,
                      name,
                    })),
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center items-center h-52">
              <Button
                disabled={isDisabled || isLoading}
                variant={"submit"}
                onClick={handleSubmit}
              >
                {isLoading ? "Salvando..." : "Atualizar Setor"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setor Atualizado com Sucesso!</DialogTitle>
            <DialogDescription>
              O setor foi atualizado com sucesso. Clique em "Fechar" para voltar
              à lista de setores.
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
