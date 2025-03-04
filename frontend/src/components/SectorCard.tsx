import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileChartPie, Edit2Icon, EyeIcon, TrashIcon } from "lucide-react";

export default function SectorCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[716px] overflow-y-auto">
      <div className=" grid grid-cols-3 gap-[38px]">
        {[...Array(18)].map((_, index) => (
          <Card key={index} className="overflow-hidden rounded-2xl shadow-md flex ">
            <div className="bg-green-light w-6"></div>
            <CardContent className="flex flex-col">
                <div className="relative flex flex-row justify-between">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-xl pt-[15px] pb-[5px]">Setor de Soldagem</h3>
                        <p className="text-sm text-gray-600">100 Bandejas Linkadas</p>
                        <p className="text-sm text-gray-600">Nº de estações: 05</p>
                    </div>
                    <div className="absolute pt-[9px] -right-12">
                        <div className="flex flex-col gap-[6px]">
                            <button><Edit2Icon className="h-[20px] w-[20px] text-gray-400  border-gray-400 border-2 rounded-sm hover:bg-yellow-300" /></button>
                            <button><EyeIcon className="h-[20px] w-[20px] text-gray-400  border-gray-400 border-2 rounded-sm hover:bg-blue-300 " /></button>
                            <button><TrashIcon className="h-[20px] w-[20px] text-gray-400  border-gray-400 border-2 rounded-sm hover:bg-red-300" /></button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-x-7 pt-6">
                    <p className="mt-2 font-semibold text-xs text-gray-dark">Total de Ocorrências: 120</p>
                    <Button className="bg-transparent border-gray-400 border-2 text-gray-dark rounded-2xl h-[18px] text-[10px] mt-2 hover:bg-green-300 ">
                        <FileChartPie className=" text-gray-dark" size={15}/> Gerar Relatório
                    </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}