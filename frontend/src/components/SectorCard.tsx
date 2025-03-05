import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2Icon, EyeIcon, FileChartPie, TrashIcon } from "lucide-react";

type WorkstationType = "normal" | "defective" | "final";

type Workstation = {
  id: number;
  description: string;
  type: WorkstationType;
  sectorName: string;
  createdAt: string;
  updatedAt: string;
};

export type SectorProps = {
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  workstations: Workstation[];
};

type Props = Pick<SectorProps, "name" | "workstations">;

export function SectorCard({ name, workstations }: Props) {
  return (
    <Card className="overflow-hidden rounded-xl bg-[#f6f6f6] h-28 shadow-md w-full flex">
      <div className="bg-green-light shrink-0 w-4" />
      <CardContent className="flex flex-row w-full p-2 relative">
        <div className="flex flex-col justify-between ">
          <div className="flex flex-col">
            <h2 className="font-semibold text-base">{name}</h2>
            <p className="text-xs opacity-50">
              Nº de estações: {workstations.length}
            </p>
          </div>
          <div className="flex mb-2 flex-row gap-x-4 items-center">
            <p className="font-semibold whitespace-nowrap text-xs opacity-70">
              Total de Ocorrências: 120
            </p>
            <Button className="px-3 bg-transparent border border-black opacity-50 rounded-2xl h-4 text-[10px] hover:bg-green-300 ">
              <FileChartPie className="text-black size-3" />
              <span className="text-black font-normal">Gerar Relatório</span>
            </Button>
          </div>
        </div>
        <div className="right-1.5 top-1.5 absolute flex flex-col gap-1.5">
          <button className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-yellow-300">
            <Edit2Icon className="fill-black " />
          </button>
          <button className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-blue-300">
            <EyeIcon className="fill-black text-white " />
          </button>
          <button className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-red-300">
            <TrashIcon className="fill-black" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
