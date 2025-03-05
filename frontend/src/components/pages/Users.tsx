import { DefaultLayout } from "../layouts/DefaultLayout";
import UserPage from '../UserPage';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Modal from "../Modal"; 
import { useState } from "react";

export function Users() {
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);

  return (
    <DefaultLayout>
      <div>
        <header className="flex justify-between mx-[36px] mt-[32px]">
          <div className="flex flex-row gap-[23px]">
            <h2 className="text-2xl font-bold">Usuários</h2>
            <p className="text-sm text-gray-500 py-[12px]">X usuários cadastrados.</p>
          </div>
          <div className="flex flex-row gap-[20px]">
            <div className="relative w-[490px] h-[45px]">
              <Search className="absolute left-3 top-2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder=" Buscar"
                className="pl-10 rounded-2xl bg-gray-100"
              />
            </div>
            <div>
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-2xl"
                onClick={handleOpenModal}
              >
                <Plus /> Adicionar Usuário
              </Button>
            </div>
          </div>
        </header>
        
        <UserPage avatar={""} name={""} surName={""} />
        <Modal isOpen={openModal} onClose={handleCloseModal} />
      </div>
    </DefaultLayout>
  );
}
