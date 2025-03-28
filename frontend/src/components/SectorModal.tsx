import { api } from "@/api/axios";
import useQRCodeGenerator, {
  FormatTypesProps,
} from "@/hooks/useQRCodeGenerator";
import { SectorProps, WorkstationProps } from "@/types";
import { ChevronDown, ChevronUp, CirclePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { WorkstationCard } from "./cards/WorkstationCard";
import { ErrorDialog } from "./ErrorDialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SectorModalProps {
  mode: "view" | "edit";
  sector: SectorProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onDelete?: () => void;
}

export function SectorModal({
  mode,
  sector,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: SectorModalProps) {
  const [sectorName, setSectorName] = useState(sector?.name || "");
  const [localWorkstations, setLocalWorkstations] = useState<
    WorkstationProps[]
  >([]);
  const [amountTrays, setAmountTrays] = useState(sector?.amountTrays || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [format, setFormat] = useState<FormatTypesProps>("png");
  const { generateAndDownloadZip, isGenerating } = useQRCodeGenerator();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const previousAmountTrays = useRef<number>(0);

  const invalidSectorName =
    sectorName
      .split("")
      .filter((e) => e.trim().length)
      .join("").length < 3;

  const invalidWsName = localWorkstations.some((ws) => {
    return (
      ws.name
        .split("")
        .filter((e) => e.trim().length)
        .join("").length < 2
    );
  });

  const isDisabled =
    mode === "edit" &&
    (invalidSectorName || localWorkstations.length < 3 || invalidWsName);

  const handleAddingStation = () => {
    const newStation: WorkstationProps = {
      name: "",
      localId: uuidv4(),
    };
    setLocalWorkstations([...localWorkstations, newStation]);
  };

  const handleDeleteStation = (localId: string) => {
    const updatedStations = localWorkstations.filter(
      (station) => station.localId !== localId
    );
    setLocalWorkstations(updatedStations);
  };

  const handleNameChange = (localId: string, name: string) => {
    const updatedStations = localWorkstations.map((station) =>
      station.localId === localId ? { ...station, name } : station
    );
    setLocalWorkstations(updatedStations);
  };

  const generateTrays = async (amount: number) => {
    await generateAndDownloadZip({
      amount,
      prefix: "BDJ",
      fileName: "bandeja",
      format,
      folderName: `bandejas-${format}`,
    });
  };

  const handleSubmit = async () => {
    if (!sector) return;
    try {
      setIsLoading(true);

      const workstationsForApi: WorkstationProps[] = localWorkstations.map(
        (station) => ({
          id: station.id,
          sectorName: sectorName,
          name: station.name,
        })
      );

      const data: SectorProps = {
        name: sectorName,
        workstations: workstationsForApi,
        amountTrays,
      };

      const res = await api.patch(`/sectors/${sector.name}`, data);
      if (res.status === 200) {
        toast.success("Setor atualizado com sucesso!");
        const amount = amountTrays - previousAmountTrays.current;
        if (amount > 0) {
          await generateTrays(amount);
          toast.success("Bandejas adicionadas com sucesso!");
        } else if (amountTrays != previousAmountTrays.current) {
          toast.success("Bandejas removidas com sucesso!");
        }
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao atualizar setor:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sector && open) {
      setSectorName(sector.name);
      previousAmountTrays.current = sector.amountTrays || 0;
      setAmountTrays(sector.amountTrays || 0);
      setLocalWorkstations(
        sector.workstations.map((ws) => ({
          ...ws,
          localId: uuidv4(),
        }))
      );
    } else if (!open) {
      // Resetar os estados quando o modal for fechado
      setSectorName(sector?.name || "");
      setLocalWorkstations([]);
      setAmountTrays(sector?.amountTrays || 0);
      setFormat("png"); // ou o formato padrão que você preferir
    }
  }, [sector, open]);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-none bg-transparent p-0 rounded-xl max-w-2xl">
          <div className="rounded-xl bg-white child:px-4 w-full max-h-[80vh] overflow-hidden border-2 flex flex-col border-green-light">
            <div className="bg-green-light shrink-0 flex items-center justify-center w-full h-10 px-4">
              <h1 className="text-white font-semibold text-lg">
                {mode === "view" ? "Visualizar Setor" : "Editar Setor"}
              </h1>
            </div>
            <div className="flex-1 flex flex-row p-3 gap-4 overflow-y-auto">
              {/* SectorProps Section */}
              <div className="basis-3/4 flex flex-col justify-evenly gap-6">
                <div className="flex flex-col gap-1">
                  <Label className="font-normal text-base">Nome do Setor</Label>
                  <input
                    type="text"
                    placeholder={"Nome único com pelo menos 3 caracteres..."}
                    className="rounded-md w-full px-3 py-1 font-medium bg-gray-input placeholder:text-gray-placeholder placeholder:font-normal"
                    value={sectorName}
                    onChange={(e) => setSectorName(e.target.value)}
                    disabled={mode === "view"}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Label className="font-normal text-base">Estações</Label>
                      {localWorkstations.length < 3 && (
                        <span className="text-gray-400 text-xs">
                          (Um setor deve ter pelo menos 3 estações)
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col h-40 overflow-y-auto custom-scrollbar">
                      {localWorkstations.map((station, i) => (
                        <WorkstationCard
                          key={station.localId}
                          station={station}
                          isLatest={i === localWorkstations.length - 1}
                          onDelete={() => {
                            if (mode === "edit") {
                              handleDeleteStation(station.localId!);
                            }
                          }}
                          name={station.name}
                          onNameChange={handleNameChange}
                          readOnly={mode === "view"}
                        />
                      ))}
                    </div>
                  </div>
                  {mode === "edit" && (
                    <button
                      className="rounded-md py-2 text-xs child:text-gray-dark hover:brightness-90 transition-all gap-2 w-full flex flex-row items-center justify-center font-normal bg-gray-input"
                      onClick={handleAddingStation}
                    >
                      <CirclePlus className="size-4" />
                      <span>Adicionar estação</span>
                    </button>
                  )}
                </div>
              </div>
              {/* Tray Section */}
              <div className="basis-1/4 flex flex-col gap-[23px]">
                <div className="flex flex-col gap-1">
                  <h1 className="text-base">Nº de Bandejas</h1>
                  <div className="w-full flex flex-col items-center justify-between">
                    <div className="w-full relative">
                      <input
                        type="number"
                        min={1}
                        value={amountTrays}
                        onChange={(e) => setAmountTrays(Number(e.target.value))}
                        className={`custom-number-input rounded-md border border-gray-500 font-medium text-center ${
                          mode === "edit" ? "px-3" : "pl-4"
                        } py-1 bg-gray-200 w-full`}
                        disabled={mode === "view"}
                      />
                      {mode === "edit" && (
                        <div className="chevron-buttons border-l border-l-gray-500 flex w-8 flex-col shrink h-8 items-center absolute top-[1px] right-[1px]">
                          <ChevronUp className=" bg-transparent rounded-tr-[5px] size-5 text-gray-700 border-b border-b-gray-500 w-full" />
                          <ChevronDown className="size-5 rounded-br-[5px] text-gray-700 w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {mode === "edit" && (
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
                )}
              </div>
            </div>
            {mode === "edit" && (
              <div className="flex justify-end gap-2 p-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="submit"
                  onClick={handleSubmit}
                  disabled={isDisabled || isLoading}
                >
                  {isLoading || isGenerating
                    ? "Salvando..."
                    : "Salvar Alterações"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Setor</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar o setor "{sectorName}"? (Suas
              respectivas estações também serão excluídas).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={() => {
                onDelete?.();
                setIsDeleteModalOpen(false);
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Deletando..." : "Sim"}
            </Button>
            <Button
              variant={"default"}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ErrorDialog
        action="atualizar setor"
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        additionalText="Certifique-se de que não exista nenhum outro setor com o mesmo nome."
      />
    </>
  );
}
