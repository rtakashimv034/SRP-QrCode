import HistoryIcon from "@/assets/Icon awesome-history.svg";
import ClockIcon from "@/assets/Icon material-access-time.svg";
import ReportIcon from "@/assets/Icon_simple_everplaces.svg";
import { FileChartPie } from "lucide-react";
import { OccurrenceCard } from "../cards/OccurrenceCard";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Button } from "../ui/button";

export function Reports() {
  return (
    <DefaultLayout>
      <div className="flex flex-row h-[calc(100%-51.2px)] mx-7 mt-6 gap-7">
        {/* Seção de Ocorrências */}
        <div className="flex flex-col flex-grow w-[60%] gap-3">
          <OccurrenceCard type="sector" icon={ReportIcon} />
          <OccurrenceCard type="time" icon={ClockIcon} />
        </div>

        {/* Seção de Histórico de Infrações */}
        <div className="flex flex-col flex-grow w-[40%]">
          <header className="flex items-center gap-2">
            <img
              src={HistoryIcon}
              alt="HistoryIcon"
              className="w-5 h-5 my-auto"
            />
            <h1 className="flex-grow text-2xl font-bold">
              Histórico de Infrações
            </h1>
          </header>

          {/* Tabela de Histórico */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-0">
              <thead>
                <tr className="bg-green-light text-white child:text-sm child:px-1">
                  <th className="border border-gray-900 border-l rounded-tl-lg py-2">
                    Produto
                  </th>
                  <th className="border border-gray-900 border-l-0 py-2">
                    Status
                  </th>
                  <th className="border border-gray-900 border-l-0 py-2">
                    Horário
                  </th>
                  <th className="border border-gray-900 border-l-0 rounded-tr-lg py-2">
                    Relatório
                  </th>
                </tr>
              </thead>
              <tbody className="child:text-sm child:child:px-1">
                <tr className="border-b border-gray-900">
                  <td className="border border-gray-900 border-t-0 border-l py-2">
                    #102
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    <div className="flex items-center gap-1 flex-row">
                      <span className="w-2.5 h-2.5 mt-0.5 bg-green-500 rounded-full inline-block" />
                      <span>Normal</span>
                    </div>
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    08:03
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
                      <FileChartPie className="text-gray-700" size={15} />
                      Gerar Relatório
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-900">
                  <td className="border border-gray-900 border-t-0 border-l py-2">
                    #102
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    <div className="flex items-center gap-1 flex-row">
                      <span className="w-2.5 h-2.5 mt-0.5 bg-red-500 rounded-full inline-block" />
                      <span>Defeito</span>
                    </div>
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    08:03
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
                      <FileChartPie className="text-gray-700" size={15} />
                      Gerar Relatório
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-900">
                  <td className="border border-gray-900 border-t-0 border-l py-2 rounded-bl-lg">
                    #001
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    <div className="flex items-center gap-1 flex-row">
                      <span className="w-2.5 h-2.5 mt-0.5 bg-red-500 rounded-full inline-block" />
                      <span>Defeito</span>
                    </div>
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                    08:03
                  </td>
                  <td className="border border-gray-900 border-t-0 border-l-0 py-2 rounded-br-lg">
                    <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
                      <FileChartPie className="text-gray-700" size={15} />
                      Gerar Relatório
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
