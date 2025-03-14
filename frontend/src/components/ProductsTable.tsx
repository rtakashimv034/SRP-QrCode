import { FileChartPie } from "lucide-react";
import { DefectivePathsProps } from "./pages/Reports";
import { Button } from "./ui/button";

export type DefectiveProductProps = {
  id: number;
  createdAt: string;
  defectivePaths: DefectivePathsProps[];
};

type Props = {
  data: DefectiveProductProps[];
};

export function ProductsTable({ data }: Props) {
  return (
    <table className="w-full text-center border-separate border-spacing-0">
      <thead>
        <tr className="bg-green-light text-white child:text-sm child:px-1">
          <th className="border border-gray-900 border-l rounded-tl-lg py-2">
            Produto
          </th>
          <th className="border border-gray-900 border-l-0 py-2">Horário</th>
          <th className="border border-gray-900 border-l-0 rounded-tr-lg py-2">
            Relatório
          </th>
        </tr>
      </thead>
      <tbody className="child:text-sm child:child:px-1">
        {data.map((product, i) => (
          <tr key={i}>
            <td
              className={`border ${
                i === data.length - 1 && "rounded-bl-lg"
              } border-gray-900 border-t-0 border-l py-2`}
            >
              #{product.id}
            </td>
            <td className="border border-gray-900 border-t-0 border-l-0 py-2">
              {product.createdAt.slice(11, 16)}
            </td>
            <td
              className={`border ${
                i === data.length - 1 && "rounded-br-lg"
              } border-gray-900 border-t-0 border-l-0 py-2`}
            >
              <Button className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-green-300">
                <FileChartPie className="text-gray-700" size={15} />
                Gerar Relatório
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
