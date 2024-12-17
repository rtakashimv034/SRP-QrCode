import { api } from "@/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardHome } from "./CardHome";
import { Card, CardContent, CardHeader } from "./ui/card";

type Props = {
  tray: number;
  stations: number;
  cameras: number;
};

export function Home() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState<Props>();

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
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-100">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex-row gap-3 items-center">
          {/*Fazer lógica para mudar o nome de acordo com o usuário */}
          <p className="text-lg font-medium">Welcome, nome!</p>
          <button
            className="bg-white border-2 text-sm border-red-600 text-red-600 px-3 py-1 rounded-md hover:bg-red-700 hover:border-red-700 hover:text-white transition"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <CardHome
              title="Gerenciar Câmera"
              path="/camera-managment"
              associateds={3}
              registereds={registered?.cameras}
            />

            <CardHome
              title="Gerenciar Estação"
              path="/station-managment"
              associateds={5}
              registereds={registered?.stations}
            />

            <CardHome title="Gerenciar Relatório" path="/report-managmnent" />
          </div>

          {/* Coluna 2 */}
          <div className="flex flex-col gap-6">
            <CardHome
              title="Gerenciar Produtos"
              path="/product-managment"
              registereds={0}
            />

            <CardHome
              title="Gerenciar Bandejas"
              path="/tray-managment"
              registereds={registered?.tray}
            />

            <CardHome title="Gerenciar Usuários" path="/user-managment" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
