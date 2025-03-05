import ReportIcon from "@/assets/Icon_simple_everplaces.svg"
import ClockIcon from "@/assets/Icon material-access-time.svg"
import HistoryIcon from "@/assets/Icon awesome-history.svg"
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
            <header className={styles.cabeçalho}>
              <img src={HistoryIcon} alt="HistoryIcon" className={styles.icone_grande}/>
              <h1 className={styles.titulo}>Histórico de Infrações</h1>
            </header>

            <table className={styles.tabela}>
              {/* <tr className={`${styles.tbl_header} ${styles.tbl_row}`}> */}
              <tr className={styles.tbl_header_row}>
                <th>Setor</th>
                <th>Bandeja</th>
                <th>Status/Gravidade</th>
                <th>Horário</th>
                <th>Relatório</th>
              </tr>
              <tr className={styles.tbl_row}>
                <td>#001</td>
                <td>Bandeja#102</td>
                <td><span className={styles.leve}></span>Leve</td>
                <td>08:03</td>
                <td >
                  <Button className="bg-transparent border-gray-400 border-2 text-gray-dark rounded-2xl h-[18px] text-[10px] mt-auto mb-auto hover:bg-green-300 "> 
                    <FileChartPie className=" text-gray-dark" size={15}/> Gerar Relatório
                  </Button>
                </td>
              </tr>
              <tr className={styles.tbl_row}>
                <td>#001</td>
                <td>Bandeja#102</td>
                <td><span className={styles.mediana}></span>Mediana</td>
                <td>08:03</td>
                <td >
                  <Button className="bg-transparent border-gray-400 border-2 text-gray-dark rounded-2xl h-[18px] text-[10px] mt-auto mb-auto hover:bg-green-300 "> 
                    <FileChartPie className=" text-gray-dark" size={15}/> Gerar Relatório
                  </Button>
                </td>
              </tr>
              <tr className={styles.tbl_row}>
                <td>#001</td>
                <td>Bandeja#102</td>
                <td><span className={styles.grave}></span>Grave</td>
                <td>08:03</td>
                <td>
                  <Button className="bg-transparent border-gray-400 border-2 text-gray-dark rounded-2xl h-[18px] text-[10px] mt-auto mb-auto hover:bg-green-300 "> 
                    <FileChartPie className=" text-gray-dark" size={15}/> Gerar Relatório
                  </Button>
                </td>
              </tr>
            </table>
          </div>
        </div>
    </DefaultLayout>
  );
}
