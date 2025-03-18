import { api } from "@/api/axios";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SectorCard } from "../cards/SectorCard";
import {
  LocalWorkstationProps,
  WorkstationCard,
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

import useQRCodeGenerator from "@/hooks/useQRCodeGenerator";
import { LocalWorkstation, Sector } from "@/types/sectors";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CreateSector() {
  const [name, setSectorName] = useState("");
  const [workstations, setWorkstations] = useState<LocalWorkstation[]>([]);
  const [amountTrays, setAmountTrays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateAndDownloadZip, isGenerating } = useQRCodeGenerator();

  const navigate = useNavigate();

  const invalidSectorName =
    name
      .split("")
      .filter((e) => e.trim().length)
      .join("").length < 3;

  const invalidWsName = workstations.some((ws) => {
    return (
      ws.name
        .split("")
        .filter((e) => e.trim().length)
        .join("").length < 2
    );
  });

  const isDisabled =
    invalidSectorName ||
    workstations.length < 3 ||
    invalidWsName ||
    amountTrays < 1;

  const handleAddingStation = () => {
    const newStation: LocalWorkstationProps = {
      name: "",
      localId: uuidv4(),
    };
    setWorkstations([...workstations, newStation]);
  };

  const handleDeleteStation = (id: string) => {
    const updatedStations = workstations.filter(
      (station) => station.localId !== id
    );
    setWorkstations(updatedStations);
  };

  const generateTrays = async (amountTrays: number) => {
    await generateAndDownloadZip(amountTrays, "BDJ");
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data: Sector = { name, workstations, amountTrays };
      const { status } = await api.post("/sectors", data);
      if (status === 201) {
        setIsModalOpen(true);
        setWorkstations([]);
        setSectorName("");
        await generateTrays(amountTrays);
      }
    } catch (error) {
      alert(`could not create sector: ${error}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (id: string, name: string) => {
    const updatedStations = workstations.map((station) =>
      station.localId === id ? { ...station, name } : station
    );
    setWorkstations(updatedStations);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1);
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
      <div className="flex-1 grid grid-cols-[55%_45%] pt-2">
        <div className="flex flex-col justify-between gap-4 items-center pr-4">
          {/* sector card */}
          <div className="rounded-xl child:px-4 w-full h-full overflow-hidden border-2 flex flex-col border-green-light">
            <div className="bg-green-light shrink-0 flex items-center w-full h-10">
              <h1 className="text-white font-semibold text-lg">
                Dados do setor
              </h1>
            </div>
            <div className="flex-1 flex justify-evenly pb-2 flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label className="font-normal text-base">Nome do Setor</Label>
                <input
                  type="text"
                  placeholder="Lorem Ipsum"
                  className="rounded-md w-full px-3 py-1 font-medium bg-gray-input placeholder:text-gray-placeholder placeholder:font-normal"
                  onChange={(e) => setSectorName(e.target.value)}
                  value={name}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-0.5">
                  <Label className="font-normal text-base">Estações</Label>
                  <div className="flex flex-col h-40 overflow-y-auto custom-scrollbar">
                    {workstations.map((station, i) => (
                      <WorkstationCard
                        key={station.localId}
                        station={station}
                        isLatest={i === workstations.length - 1}
                        onDelete={() => handleDeleteStation(station.localId)}
                        name={station.name} // Pass name
                        onNameChange={handleNameChange} // Pass onNameChange
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
          {/* Tray card */}
          <div className="rounded-xl child:px-4 w-full h-full overflow-hidden border-2 flex flex-col basis-1/3 border-green-light">
            <div className="bg-green-light shrink-0 flex items-center w-full h-10">
              <h1 className="text-white font-semibold text-lg">
                Adicionar Bandejas
              </h1>
            </div>
            <div className="h-full flex flex-col justify-center items-center">
              <div className=" h-full py-1.5 flex flex-col items-center justify-between">
                <h1 className="text-base leading-none">Bandejas Disponíveis</h1>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={amountTrays}
                    onChange={(e) => setAmountTrays(Number(e.target.value))}
                    className="custom-number-input rounded-md border border-gray-500 font-medium pr-1 pl-3 py-1 bg-gray-200 w-24"
                  />
                  <div className="chevron-buttons border-l border-l-gray-500 flex w-8 flex-col shrink h-8 items-center absolute top-[1px] right-[1px]">
                    <ChevronUp className=" bg-transparent rounded-tr-[5px] size-5 text-gray-700 border-b border-b-gray-500 w-full" />
                    <ChevronDown className="size-5 rounded-br-[5px] text-gray-700 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center pl-4">
          <div className="w-full h-full max-h-96 flex flex-col justify-center items-center">
            <div className="flex flex-col h-full w-full border-2 rounded-lg border-green-light py-2 px-4">
              <h1 className="flex font-bold text-xl">Visualização:</h1>
              <div className="flex-1 flex justify-center items-center px-8">
                <SectorCard
                  disabled={true}
                  data={{ name, workstations, amountTrays }}
                />
              </div>
            </div>
            <div className="flex justify-center items-center h-52">
              <Button
                disabled={isDisabled || isLoading}
                variant={"submit"}
                onClick={handleSubmit}
              >
                {isLoading || isGenerating ? "Salvando..." : "Salvar Setor"}
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
              Setor cadastrado com sucesso. Clique em "Fechar" para voltar à
              lista de setores.
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
