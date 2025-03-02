import ReportIcon from "@/assets/Icon_simple_everplaces.svg"
import ClockIcon from "@/assets/Icon material-access-time.svg"
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Button } from "../ui/button";
import { FileChartPie } from "lucide-react";
import styles from "./Reports.module.css"

export function Reports() {

  return (
    <DefaultLayout>
        <div className={styles.tela}>

          <div className={styles.ocorrencias}>

            <div className={styles.ocorrencia}>
              <header className={styles.cabeçalho}>
                <img src={ReportIcon} alt="ReportIcon" className={styles.icone_grande}/>
                <h1 className={styles.titulo}>Ocorrência por Setores</h1>
                <Button className="bg-transparent border-gray-400 border-2 text-gray-dark rounded-2xl h-[18px] text-[10px] mt-auto mb-auto hover:bg-green-300 "> 
                        <FileChartPie className=" text-gray-dark" size={15}/> Gerar Relatório
                </Button>
              </header>

              <div className={styles.grafico}>
              </div>
            </div>

            <div className={styles.ocorrencia}>
              <header className={styles.cabeçalho}>
                <img src={ClockIcon} alt="ClockIcon" className={styles.icone_grande}/>
                <h1 className={styles.titulo}>Ocorrência por Tempo</h1>
                <Button className="bg-transparent border-gray-400 border-2 text-gray-dark rounded-2xl h-[18px] text-[10px] mt-auto mb-auto hover:bg-green-300 "> 
                        <FileChartPie className=" text-gray-dark" size={15}/> Gerar Relatório
                </Button>
              </header>

              <div className={styles.grafico}>
              </div>
            </div>

          </div>
          
          <div className={styles.historico}>
            
          </div>
        </div>
    </DefaultLayout>
  );
}
