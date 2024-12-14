import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex-row gap-3 items-center">
          {/*Fazer lógica para mudar o nome de acordo com o usuário */}
          <p className="text-lg font-medium">Welcome, nome!</p>
          <button 
            className="bg-white border-2 text-sm border-red-600 text-red-600 px-3 py-1 rounded-md hover:bg-red-700 hover:border-red-700 hover:text-white transition"
            onClick={() => navigate("/login")}>
              Logout
          </button>
        
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-6">
          {/* Coluna 1 */}
          <div className="flex flex-col gap-6">
            {/* Gerenciando Câmera div */}
            <div className=" cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px] hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200" onClick={()=> navigate("/gerenciarCamera")}>
              <CardTitle className="text-2xl font-bold">Gerenciar Câmera</CardTitle>
              <CardDescription>
                <p>Totais Cadastrados: 5</p>
                <p>Totais Associados: 3</p>
              </CardDescription>
            </div>

            {/* Gerenciando Estação div */}
            <div className="cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px]  hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200 " onClick={()=> navigate("/gerenciarEstacao")}>
              <CardTitle className="text-2xl font-bold">Gerenciar Estação</CardTitle>
              <CardDescription>
                <p>Totais Cadastrados: 5</p>
                <p>Totais Associados: 3</p>
              </CardDescription>
            </div>

            {/* Gerar Relatório div */}
            <div className="cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px] flex items-center justify-start  hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200">
              <CardTitle className="text-2xl font-bold">Gerar Relatório</CardTitle>
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="flex flex-col gap-6">
            {/* Gerenciar Produtos div */}
            <div className="cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px]  hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200">
              <CardTitle className="text-2xl font-bold">Gerenciar Produtos</CardTitle>
              <CardDescription>
                <p>Totais Cadastrados: 5</p>
              </CardDescription>
            </div>

            {/* Gerenciar Bandejas div */}
            <div className="cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px]  hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200">
              <CardTitle className="text-2xl font-bold">Gerenciar Bandeja</CardTitle>
              <CardDescription>
                <p>Totais Cadastrados: 5</p>
              </CardDescription>
            </div>

            {/* Gerenciar Usuários div */}
            <div className="cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px]  hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200">
              <CardTitle className="text-2xl font-bold">Gerenciar Usuários</CardTitle>
              <CardDescription>
                <p>Totais Cadastrados: 5</p>
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
