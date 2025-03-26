import { DefectiveProductProps } from "@/types";
import { FileChartPie } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  products: DefectiveProductProps[];
};

export function DefectiveProductsTable({ products }: Props) {
  const handleGenerateReport = (product: DefectiveProductProps) => {
    const fileName = `RELATÓRIO_DPROD-${product.id}.txt`;
    const paths = product.defectivePaths?.sort(
      (a, b) =>
        new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
    );

    let reportContent = `[+] Relatório do produto defeituoso Nº${product.id}\n\n`;
    reportContent += `  - Data e Hora: ${product.createdAt}\n`;
    if (paths && paths.length > 0) {
      reportContent += `  - Histórico de tráfego:\n`;
      paths.forEach((path, index) => {
        reportContent += `    ${index + 1}. O produto passou ${
          path.sectorName
            ? `${
                path.stationId ? `na estação #${path.stationId} do` : "pelo"
              } setor "${path.sectorName}"`
            : "por alguma estação"
        } às ${path.registeredAt};\n`;
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
        {products.length > 0 ? (
          products.map((product, i) => (
            <tr key={i}>
              <td
                className={`border ${
                  i === products.length - 1 && "rounded-bl-lg"
                } border-gray-900 border-t-0 border-l py-2`}
              >
                #{product.id}
              </td>
              <td className="border border-gray-900 border-t-0 border-l-0 py-2">
                {product.createdAt.slice(11, 16)}
              </td>
              <td
                className={`border ${
                  i === products.length - 1 && "rounded-br-lg"
                } border-gray-900 border-t-0 border-l-0 py-2`}
              >
                <Button
                  className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:brightness-90 transition-all"
                  onClick={() => handleGenerateReport(product)}
                >
                  <FileChartPie className="text-gray-700" size={15} />
                  Gerar Relatório
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={3}
              className="border border-t-0 border-gray-900 rounded-b-lg py-2 font-light opacity-70"
            >
              Nenhum produto com defeito detectado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
