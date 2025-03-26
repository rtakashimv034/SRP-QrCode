import { ProductProps } from "@/types";
import { months } from "@/utils/months";
import { Schedule } from "@/utils/schedule";
import { FileChartPie } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
  product: ProductProps;
  schedule: Schedule;
};

export function ProductCard({ product, schedule }: Props) {
  const year = Number(product.createdAt.slice(0, 4));
  const month = Number(product.createdAt.slice(5, 7));
  const day = product.createdAt.slice(8, 10);
  const hour = product.createdAt.slice(11, 16);

  const handleGenerateReport = () => {
    const fileName = `RELATÓRIO_${product.SN}.txt`;
    const paths = product.paths?.sort(
      (a, b) =>
        new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
    );

    let reportContent = `[+] Relatório do produto ${product.SN}\n\n`;
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
    <Card className="bg-gray-card overflow-hidden rounded-xl h-14 shadow-md w-full flex border-none">
      <div className="bg-green-light shrink-0 w-4" />
      <CardContent className="flex flex-row w-full p-2 justify-between">
        <div className="flex flex-col justify-center items-start">
          <h1 className="font-semibold text-xl">{product.SN}</h1>
          <span className="text-xs opacity-50">
            {schedule === "Diário"
              ? `Registrado no dia ${day} às ${hour}`
              : schedule === "Mensal"
              ? `Registrado no dia ${day} de ${months[month - 1]} às ${hour}`
              : `Registrado em ${day}/${month}/${year} às ${hour}`}
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Button
            className="bg-transparent border border-gray-400 text-gray-700 rounded-2xl h-7 text-xs hover:bg-gray-default transition-all"
            onClick={handleGenerateReport}
          >
            <FileChartPie className="text-gray-700" size={15} />
            Gerar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
