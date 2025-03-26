import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SectorProps } from "@/types";
import { Edit2Icon, EyeIcon, FileChartPie, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";

type Props = {
  data: SectorProps;
  disabled?: boolean;
  onDelete?: () => void;
  onViewSector?: () => void;
  onUpdate?: () => void;
};

type ReportType = "normal" | "defectiva";

export function SectorCard({
  data,
  disabled = false,
  onDelete,
  onViewSector,
  onUpdate,
}: Props) {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("defectiva");

  const handleGenerateReport = (type: ReportType) => {
    const fileName = `RELATÓRIO_${
      type === "normal" ? "ORDINAL" : "DEFECTIVO"
    }-${data.name}.txt`;
    let genericPaths;
    if (type === "normal") {
      genericPaths = data.paths?.sort(
        (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime()
      );
    } else {
      genericPaths = data.defectivePaths?.sort(
        (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime()
      );
    }
    let reportContent = `[+] Relatório ${
      type === "normal" ? "ordinal" : "de ocorrências"
    } do setor "${data.name}"\n\n`;
    reportContent += `  - Data de emissão: ${new Date().toLocaleString()}\n`;
    if (genericPaths && genericPaths.length > 0) {
      reportContent += `  - Histórico de ocorrências:\n`;
      genericPaths.forEach((path, index) => {
        reportContent += `    ${index + 1}. Houve uma ocorrência ${type} às ${
          path.registeredAt
        } ${
          path.stationId ? `na estação #${path.stationId}` : "em alguma estação"
        };\n`;
      });
    } else {
      reportContent += `  [ERRO]: Não foi possível resgatar o histórico do produto.\n`;
    }

    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="overflow-hidden rounded-xl bg-gray-card border-none h-28 shadow-md w-full flex">
        <div className="bg-green-light shrink-0 w-4" />
        <CardContent className="flex flex-row w-full p-2 relative">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col">
              <h2 className="font-semibold text-base">{data.name}</h2>
              <p className="text-xs opacity-50">
                {data.amountTrays} Bandejas Linkadas
              </p>
              <p className="text-xs opacity-50">
                Nº de estações: {data.workstations?.length}
              </p>
            </div>
            <div className="flex mb-2 flex-row gap-x-4 items-center">
              <p className="font-semibold whitespace-nowrap text-xs opacity-70">
                Total de Ocorrências: {data.defectivePaths?.length || 0}
              </p>
              <Button
                disabled={disabled}
                className="px-3 bg-transparent border border-black opacity-50 rounded-2xl h-4 text-[10px] hover:bg-green-300"
                onClick={() => setIsModalOpen(true)}
              >
                <FileChartPie className="text-black size-3" />
                <span className="text-black font-normal">Gerar Relatório</span>
              </Button>
            </div>
          </div>
          <div className="right-1.5 top-1.5 absolute flex flex-col gap-1.5">
            {user?.isManager && (
              <button
                onClick={onUpdate}
                disabled={disabled}
                className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-yellow-300"
              >
                <Edit2Icon className="fill-black" />
              </button>
            )}
            <button
              onClick={onViewSector}
              disabled={disabled}
              className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-blue-300"
            >
              <EyeIcon className="fill-black text-white" />
            </button>
            {user?.isManager && (
              <button
                disabled={disabled}
                className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-red-300"
                onClick={onDelete}
              >
                <TrashIcon className="fill-black" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border-none bg-transparent p-0 rounded-xl max-w-[24rem]">
          <div className="rounded-xl bg-white child:px-4 w-full overflow-hidden border-2 flex flex-col border-green-light">
            <div className="bg-green-light shrink-0 flex items-center justify-center w-full h-10 px-4">
              <h1 className="text-white font-semibold text-lg">
                Histórico do setor {data.name}
              </h1>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-1 pb-3 pt-2">
              <h1 className="font-semibold text-lg">Tipo de histórico</h1>
              <div className="child:child:text-sm flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Input
                    className="size-4 hover:cursor-pointer"
                    type="checkbox"
                    checked={reportType === "defectiva"}
                    onChange={() => setReportType("defectiva")}
                  />
                  <span>Histórico de ocorrências (Defectivos).</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    className="size-4 hover:cursor-pointer"
                    type="checkbox"
                    checked={reportType === "normal"}
                    onChange={() => setReportType("normal")}
                  />
                  <span>Histórico ordinal (Normais).</span>
                </div>
              </div>
            </div>
            <div className="flex py-2 flex-row justify-evenly gap-2 border-t-2">
              <Button
                size={"sm"}
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="submit"
                size={"sm"}
                onClick={() => handleGenerateReport(reportType)}
              >
                Gerar relatório
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
