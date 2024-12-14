import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader,} from "./ui/card";

export function GerenciarEstacao() {
    const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
        <Card className="w-full max-w-4xl"> 
            <CardHeader className="flex-row justify-between items-center border-b px-4 py-2">
                <button 
                    className="bg-white text-black border-2 border-black text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:border-gray-600 transition"
                    onClick={() => navigate("/home")}>
                    Back
                </button>

                <button 
                    className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                    Cadastrar Estação
                </button>
            </CardHeader>
            <CardContent className="px-4 py-2">
                <div className="overflow-x-auto max-h-[400px]"> 
                    <table className="min-w-full table-auto border-separate border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-center w-1/4">Estação</th> {/* Diminuindo um pouco as larguras das colunas */}
                                <th className="px-4 py-2 border-b text-center w-1/4">Setor</th>
                             
                                <th className="px-4 py-2 border-b text-center w-1/4"></th> {/* Igualando a largura das colunas */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">1</td>
                                <td className="px-4 py-2 border-x border-b text-center">90</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">9</td>
                                <td className="px-4 py-2 border-x border-b text-center">20</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">2</td>
                                <td className="px-4 py-2 border-x border-b text-center">40</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">9</td>
                                <td className="px-4 py-2 border-x border-b text-center">70</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">3</td>
                                <td className="px-4 py-2 border-x border-b text-center">20</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">11</td>
                                <td className="px-4 py-2 border-x border-b text-center">50</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">8</td>
                                <td className="px-4 py-2 border-x border-b text-center">88</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-x border-b text-center">1</td>
                                <td className="px-4 py-2 border-x border-b text-center">90</td>
                                
                                <td className="px-4 py-2 border-b text-center flex justify-center items-center space-x-2">
                                    <button className="bg-white text-blue-500 border-2 border-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 hover:border-blue-700 transition">
                                        Gerar QRcode
                                    </button>
                                    <button className="border-2 border-red-500 px-3 py-1 rounded-md hover:bg-red-100 hover:border-red-700 transition">
                                        Excluir
                                    </button>
                                </td>
                            </tr> 
                        </tbody>
                    </table>
                </div>
                <div>
                    <hr className="border-t border-gray-300 my-2" />
                    <div className="px-4 py-2 flex justify-between items-center">
                        <p className="text-gray-700">Total: 5</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
