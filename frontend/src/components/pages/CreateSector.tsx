import { api } from "@/api/axios";
import { ArrowLeft, CirclePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SectorCard } from "../cards/SectorCard";
import { WorkstationCard } from "../cards/WorkstationCard";
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

import useQRCodeGenerator, {
  FormatTypesProps,
} from "@/hooks/useQRCodeGenerator";
import { SectorProps, WorkstationProps } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ErrorDialog } from "../ErrorDialog";
import { Input } from "../ui/input";

export function CreateSector() {
  const [name, setName] = useState("");
  const [workstations, setWorkstations] = useState<WorkstationProps[]>([]);
  const [amountTrays, setAmountTrays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateAndDownloadZip, isGenerating } = useQRCodeGenerator();
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [format, setFormat] = useState<FormatTypesProps>("png");

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
    const newStation: WorkstationProps = {
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
    await generateAndDownloadZip({
      amount: amountTrays,
      prefix: "BDJ",
      fileName: "bandeja",
      format,
      folderName: `bandejas-${format}`,
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data: SectorProps = { name, workstations, amountTrays };
      const { status } = await api.post("/sectors", data);
      if (status === 201) {
        setIsModalOpen(true);
        setWorkstations([]);
        await generateTrays(amountTrays);
      }
    } catch (error) {
      setIsErrorModalOpen(true);
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
    <>
      <DefaultLayout>
        <div className=" flex flex-row items-center justify-start gap-2">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="size-7 text-black hover:cursor-pointer"
          />
          <h1 className="text-2xl font-bold whitespace-nowrap">
            Cadastrar Setor
          </h1>
        </div>
        <div className="flex-1 grid grid-rows-[80%_20%]">
          <div className="flex-1 grid grid-cols-[60%_40%] items-center justify-start">
            <div className="flex flex-col justify-between gap-4 items-center pr-4">
              {/* sector card */}
              <div className="rounded-xl child:px-4 w-full max-h-96 overflow-hidden border-2 flex flex-col border-green-light">
                <div className="bg-green-light shrink-0 flex items-center w-full h-10">
                  <h1 className="text-white font-semibold text-lg">
                    Dados do setor
                  </h1>
                </div>
                <div className="flex-1 flex flex-row p-3 gap-4">
                  {/* Sector Section */}
                  <div className=" basis-3/4 flex flex-col justify-evenly gap-6">
                    <div className="flex flex-col gap-1">
                      <Label className="font-normal text-base">
                        Nome do Setor
                      </Label>
                      <input
                        type="text"
                        placeholder="Nome único com pelo menos 3 caracteres..."
                        className="rounded-md w-full px-3 py-1 font-medium bg-gray-input placeholder:text-gray-placeholder placeholder:font-normal"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Label className="font-normal text-base">
                            Estações
                          </Label>
                          {workstations.length < 3 && (
                            <span className="text-gray-400 text-xs">
                              (Um setor deve ter pelo menos 3 estações)
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col h-40 overflow-y-auto custom-scrollbar">
                          {workstations.map((station, i) => (
                            <WorkstationCard
                              key={station.localId}
                              station={station}
                              isLatest={i === workstations.length - 1}
                              onDelete={() =>
                                handleDeleteStation(station.localId!)
                              }
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
                  {/* Tray Section */}
                  <div className=" basis-1/4 flex flex-col gap-[23px]">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-base">Nº de Bandejas</h1>
                      <div className="w-full flex flex-col items-center justify-between">
                        <div className="w-full relative">
                          <input
                            type="number"
                            min={1}
                            value={amountTrays}
                            onChange={(e) =>
                              setAmountTrays(Number(e.target.value))
                            }
                            className="custom-number-input rounded-md border border-gray-500 font-medium px-3 text-center py-1 bg-gray-200 w-full"
                          />
                          <div className="chevron-buttons border-l border-l-gray-500 flex w-8 flex-col shrink h-8 items-center absolute top-[1px] right-[1px]">
                            <ChevronUp className=" bg-transparent rounded-tr-[5px] size-5 text-gray-700 border-b border-b-gray-500 w-full" />
                            <ChevronDown className="size-5 rounded-br-[5px] text-gray-700 w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" flex flex-col gap-1">
                      <h1>Formato</h1>
                      <div className="child:child:text-sm flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Input
                            className="size-4 hover:cursor-pointer"
                            type="checkbox"
                            checked={format === "png"}
                            onChange={() => setFormat("png")}
                          />
                          <span>PNG (.zip)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            className="size-4 hover:cursor-pointer"
                            type="checkbox"
                            checked={format === "jpeg"}
                            onChange={() => setFormat("jpeg")}
                          />
                          <span>JPEG (.zip)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            className="size-4 hover:cursor-pointer"
                            type="checkbox"
                            checked={format === "svg"}
                            onChange={() => setFormat("svg")}
                          />
                          <span>SVG (.zip)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sector Card Section */}
            <div className="h-full max-h-[372px] flex justify-center items-center pl-4">
              <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="flex flex-col h-full w-full border-2 rounded-lg border-green-light py-2 px-4">
                  <h1 className="flex font-bold text-xl">Visualização:</h1>
                  <div className="flex-1 flex justify-center items-center px-8">
                    <SectorCard
                      disabled={true}
                      data={{ name, workstations, amountTrays }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-center items-center">
            <Button
              disabled={isDisabled || isLoading}
              variant={"submit"}
              onClick={handleSubmit}
              size={"lg"}
              className="text-lg"
            >
              {isLoading || isGenerating ? "Salvando..." : "Salvar Setor"}
            </Button>
          </div>
        </div>

        {/* Modal de Sucesso */}
      </DefaultLayout>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setor cadastrado com Sucesso!</DialogTitle>
            <DialogDescription>
              Clique em "Fechar" para voltar à lista de setores.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"destructive"} onClick={handleCloseModal}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ErrorDialog
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        action="criar setor"
        additionalText="Certifique-se de que não exista nenhum outro setor com o mesmo nome."
      />
    </>
  );
}
