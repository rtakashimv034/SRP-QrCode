import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Sector } from "@/types/sectors";
import { Edit2Icon, EyeIcon, FileChartPie, TrashIcon } from "lucide-react";

type Props = {
  data: Sector;
  disabled?: boolean;
  onDelete?: () => void;
  onShowQrcode?: () => void;
  onUpdate?: () => void;
};

export function SectorCard({
  data,
  disabled = false,
  onDelete,
  onShowQrcode,
  onUpdate,
}: Props) {
  const { user } = useAuth();

  return (
    <Card className="overflow-hidden rounded-xl bg-gray-card h-28 shadow-md w-full flex">
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
            onClick={onShowQrcode}
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
  );
}
