import { api } from "@/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardHome } from "./CardHome";
import { Button } from "./ui/button";
import { Card} from "./ui/card";
import iconEverplaces from "../assets/Icon simple-everplaces.png";
import iconMaterialAccessTime from "../assets/Icon material-access-time.png";
import iconAwesomeHistory from "../assets/Icon awesome-history.png";
import grupo4 from "../assets/Grupo 4.png";
import icondocument from "../assets/Icon ionic-ios-document.png";
import iconLogout from "../assets/Icon open-account-logout.png";

type Props = {
  tray: number;
  stations: number;
  cameras: number;
};

export function Home() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState<Props>({
    tray: 0,
    stations: 0,
    cameras: 0,
  });
  const [periodo, setPeriodo] = useState("mensal");

  async function fetchQuantity() {
    try {
      const cameras = await api.get<[]>("/camera-managment");
      const stations = await api.get<[]>("/station-managment");
      const trays = await api.get<[]>("/tray-managment");

      setRegistered({
        tray: trays.data.length,
        stations: stations.data.length,
        cameras: cameras.data.length,
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchQuantity();
  }, [registered]);

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-[#DAE5DF]">
      {/* Caixa principal */}
      <Card
        className="absolute"
        style={{
          top: "120px",
          left: "515px",
          width: "1720px",
          height: "840px",
          background: `#FFFFFF`,
          boxShadow: "0px 3px 6px #0000001A",
          borderRadius: "12px",
          opacity: 1,
        }}
      >
        {/* Botão de gerar relatório */}
        <div
          style={{
            position: 'absolute',
            top: "41px", 
            left: "877px", 
            width: "152px",
            height: "24px",
            border: "1px solid #5C5C5C",
            borderRadius: "12px",
            opacity: 1,
          }}
        />

        {/* Ícone do botão de relatório */}
        <div
          style={{
            position: 'absolute',
            top: "46px",
            left: "896px",
            width: "12px",
            height: "14px",
            background: `url(${icondocument}) no-repeat center center`,
            backgroundSize: 'contain',
            opacity: 1,
          }}
        />

        {/* Texto do botão de relatório */}
        <p
          style={{
            position: 'absolute',
            top: "44px", 
            left: "915px", 
            width: "93px",
            height: "18px",
            margin: 0,
            textAlign: "left",
            font: "normal normal normal 13px/18px Open Sans",
            letterSpacing: "0px",
            color: "#5C5C5C",
            opacity: 1,
          }}
        >
          Gerar relatório
        </p>

        {/* Texto do botão de relatório 2 */}
        <p
          style={{
            position: 'absolute',
            top: "391px", 
            left: "915px", 
            width: "93px",
            height: "18px",
            margin: 0,
            textAlign: "left",
            font: "normal normal normal 13px/18px Open Sans",
            letterSpacing: "0px",
            color: "#5C5C5C",
            opacity: 1,
          }}
        >
          Gerar relatório
        </p>

        {/* Ícone do botão de relatório 2*/}
        <div
          style={{
            position: 'absolute',
            top: "391", 
            left: "896px", 
            width: "12px",
            height: "14px",
            background: `url(${icondocument}) no-repeat center center`,
            opacity: 1,
          }}
        />

        {/* Botão de gerar relatório */}
        <div
          style={{
            position: 'absolute',
            top: "387px", 
            left: "877px", 
            width: "152px",
            height: "24px",
            border: "1px solid #5C5C5C",
            borderRadius: "12px",
            opacity: 1,
          }}
        />

        {/* Dropdown de período */}
        <div
          style={{
            position: 'absolute',
            top: "391px", 
            left: "773px", 
            width: "37px",
            height: "18px",
            textAlign: "right",
            font: "normal normal normal 13px/26px Open Sans",
            letterSpacing: "0.65px",
            color: "#141533",
            opacity: 1,
          }}
        >
          {periodo}
        </div>

        {/* Ícone do dropdown */}
        <img
          src={grupo4}
          alt="Ícone Dropdown"
          style={{
            position: 'absolute',
            top: "390px", 
            left: "821px", 
            width: "20px",
            height: "20px",
            background: "transparent",
            opacity: 1,
            cursor: "pointer",
          }}
          onClick={() => {
            // Lógica para alternar entre períodos
            const novoPeriodo = 
              periodo === "mensal" ? "anual" : 
              periodo === "anual" ? "semanal" : 
              "mensal";
            setPeriodo(novoPeriodo);
          }}
        />

        {/* Elementos de Histórico */}
        <img
          src={iconAwesomeHistory}
          alt="Ícone Histórico"
          style={{
            position: 'absolute',
            top: "32px", 
            left: "1065px", 
            width: "24px",
            height: "24px",
            background: "transparent",
            opacity: 1,
          }}
        />

        <p
          style={{
            position: 'absolute',
            top: "32px", 
            left: "1101px", 
            width: "306px",
            height: "38px",
            margin: 0,
            textAlign: "left",
            font: "normal normal bold 28px/38px Open Sans",
            letterSpacing: "0px",
            color: "#011128",
            opacity: 1,
          }}
        >
          Histórico de infrações
        </p>

        <div
          style={{
            position: 'absolute',
            top: "89px", 
            left: "1065px", 
            width: "618px",
            height: "700px",
            border: "1px solid #011128",
            borderRadius: "9px",
            opacity: 1,
            boxSizing: 'border-box',
          }}
        />

        {/* Ícone de ocorrências */}
        <img
          src={iconEverplaces}
          alt="Ícone Ocorrências"
          style={{
            position: 'absolute',
            top: "55px",
            left: "40px",
            width: "24px",
            height: "24px",
            opacity: 1,
          }}
        />

        {/* Ícone de tempo */}
        <img
          src={iconMaterialAccessTime}
          alt="Ícone Tempo"
          style={{
            position: 'absolute',
            top: "388px",
            left: "36px",
            width: "25px",
            height: "25px",
            background: "transparent",
            opacity: 1,
          }}
        />

        {/* Título de ocorrências por setor */}
        <p
          style={{
            position: 'absolute',
            top: "50px",
            left: "70px",
            width: "305px",
            height: "38px",
            margin: 0,
            fontSize: "28px",
            fontWeight: "bold",
            lineHeight: "38px",
            fontFamily: "Open Sans",
            color: "#13261F",
          }}
        >
          Ocorrências por setor
        </p>

        {/* Título de ocorrências por tempo */}
        <p
          style={{
            position: 'absolute',
            top: "380px",
            left: "72px",
            width: "326px",
            height: "38px",
            margin: 0,
            fontSize: "28px",
            fontWeight: "bold",
            lineHeight: "38px",
            fontFamily: "Open Sans",
            color: "#13261F",
          }}
        >
          Ocorrências por tempo
        </p>

        {/* Retângulo de ocorrências por setor */}
        <Card
          style={{
            position: 'absolute',
            top: "90px",
            left: "36px",
            width: "993px",
            height: "258px",
            background: "#FFFFFF",
            border: "1px solid #011128",
            borderRadius: "12px",
            opacity: 1,
          }}
        />

        {/* Retângulo de ocorrências por tempo */}
        <Card
          style={{
            position: 'absolute',
            top: "439px",
            left: "36px",
            width: "993px",
            height: "350px",
            background: "#FFFFFF",
            border: "1px solid #011128",
            borderRadius: "12px",
            opacity: 1,
          }}
        />
      </Card>
        {/* Caixa inferior esquerda*/}
      <Card
        className="absolute"
        style={{
          top: "300px",
          left: "139px",
          width: "336px",
          height: "663px",
          background: `#FFFFFF`,
          boxShadow: "0px 3px 6px #0000001A",
          borderRadius: "12px",
          opacity: 1,
        }}
      >
        <CardHome
          title="Câmera" 
          path="/camera-managment"
          associateds={0}
          registereds={registered?.cameras}
          style={{
            position: 'absolute',
            top: "50px",
            left: "25px",

          }}
        />

        <CardHome
          title="Estação"
          path="/station-managment"
          associateds={0}
          registereds={registered?.stations}
          style={{
            position: 'absolute',
            top: "110px",
            left: "25px",
          }}
        />

        <CardHome
          title="Relatório"
          path="/report-managmnent"
          style={{
            position: 'absolute',
            top: "170px",
            left: "25px",
          }}
        />

        <CardHome
          title="Produtos"
          path="/product-managment"
          style={{
            position: 'absolute',
            top: "230px",
            left: "25px",
          }}
        />

        <CardHome
          title="Bandejas"
          path="/tray-managment"
          registereds={registered?.tray}
          style={{
            position: 'absolute',
            top: "290px",
            left: "25px",
          }}
        />

        <CardHome
          title="Usuários"
          path="/user-managment"
          registereds={0}
          style={{
            position: 'absolute',
            top: "350px",
            left: "25px",
          }}
        />

        <Button
          variant={"transparent"}
          onClick={() => navigate("/login")}
          style={{
            position: 'absolute',
            top: "600px",
            left: "70px",
            width: "70px",
            height: "27px",
            color: "#4B6558", 
            textAlign: "left",
            font: "normal normal normal 20px/28px Open Sans",
            letterSpacing: "0px",
            opacity: "1",
          }}
        >
          Logout
        </Button>

        {/* Novo ícone de logout */}
        <img
          src={iconLogout} 
          alt="Ícone de Logout"
          style={{
            position: 'absolute',
            top: "602px",
            left: "40px",
            width: "27px",
            height: "24px",
            background: "transparent",
            opacity: 1,
          }}
        />

      </Card>


      {/* Nova caixa superior esquerda */}
<Card
  className="absolute"
  style={{
    top: "120px",
    left: "139px",
    width: "336px",
    height: "140px",
    background: "#13261F",
    boxShadow: "0px 3px 6px #0000001A",
    borderRadius: "12px",
    opacity: 1,
  }}
/>

      {/* Texto "Bem vindo," */}
      <div
        style={{
          position: "absolute",
          top: "168px",
          left: "251px",
          width: "84px",
          height: "22px",
          textAlign: "left",
          font: "normal normal normal 16px/22px Open Sans",
          letterSpacing: "0px",
          color: "#FFFFFF",
          opacity: 1,
        }}
      >
        Bem vindo,
      </div>

      {/* Texto "Nome Sobrenome" */}
      <div
        style={{
          position: "absolute",
          top: "190px",
          left: "251px",
          width: "143px",
          height: "22px",
          textAlign: "left",
          font: "normal normal bold 16px/22px Open Sans",
          letterSpacing: "0px",
          color: "#FFFFFF",
          opacity: 1,
        }}
      >
        Nome Sobrenome
      </div>

    </div>
  );
}