import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EyeIcon, XIcon } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [key, setKey] = useState ('');

  const handlePermissionClick = (permission: string) => {
    setSelectedPermission(permission === selectedPermission ? null : permission);
  };

  const handleClear = () => {
    setNome('');
    setSobrenome('');
    setEmail('');
    setSelectedPermission(null);
  };
  const handleAdd = () => {
    if (!nome || !sobrenome || !email || !selectedPermission) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    const userData = {
      nome,
      sobrenome,
      email,
      permission: selectedPermission,
    };
    console.log("Dados do usuário a serem adicionados:", userData);
    setNome('');
    setSobrenome('');
    setEmail('');
    setSelectedPermission(null);
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-green-light w-full h-[60px] flex items-center justify-between px-4 text-white font-bold text-lg">
          <span className="mx-auto">Adicionar Usuário</span>
          <button onClick={onClose} className="text-white">
            <XIcon size={20} />
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-[100px] h-[100px] border-2 border-gray-700 rounded-full flex items-center justify-center">
            <EyeIcon className="text-gray-700 text-3xl" />
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="flex gap-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="nome" className="text-sm font-medium">Nome:</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border p-2 rounded-md w-full bg-gray-box"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="sobrenome" className="text-sm font-medium">Sobrenome:</label>
              <input
                type="text"
                id="sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className="border p-2 rounded-md w-full bg-gray-box"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="email" className="text-sm font-medium">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-md w-full bg-gray-box"
            />
          </div>
          <div className='mt-4'>
            <label htmlFor="key">Senha:</label>
              <input type="text"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className='border p-2 rounded-md w-full bg-gray-box' />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium ">Permissões:</label>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => handlePermissionClick("Administrador")}
                className={`${
                  selectedPermission === "Administrador" ? "border-yellow-400 text-yellow-400" : "border-gray-600 text-black"
                } border-2 rounded-lg px-4 py-2 bg-transparent hover:bg-gray-100`}
              >
                Administrador
              </Button>
              <Button
                onClick={() => handlePermissionClick("Supervisor")}
                className={`${
                  selectedPermission === "Supervisor" ? "border-yellow-400 text-yellow-400" : "border-gray-600 text-black"
                } border-2 rounded-lg px-4 py-2 bg-transparent hover:bg-gray-100`}
              >
                Supervisor
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 p-4">
          <Button onClick={handleClear} className="border border-gray-600 text-black px-4 py-2 rounded-md bg-transparent hover:bg-gray-100">
            Limpar
          </Button>
          <Button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded-md">Adicionar</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
