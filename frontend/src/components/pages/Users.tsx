import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import { useAuth } from "@/hooks/useAuth";
import { useCache } from "@/hooks/useCache";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { UserProps } from "@/types";
import { Plus, Search, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserCard } from "../cards/UserCard";
import { ErrorDialog } from "../ErrorDialog";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Loading } from "../Loading";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { UserModal } from "../UserModal";

type Props = UserProps[];

// Cache em memória para dados sensíveis
let inMemoryUserCache: Props | null = null;

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Props>([]);
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getCache, setCache, clearCache } = useCache<Props>({
    key: "users-cache",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { user: currentUser, signOut } = useAuth();

  const navigate = useNavigate();
  const onlineUsers = useOnlineUsers();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isErrorDeletion, setIsErrorDeletion] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsPageLoading(true);
      // Verifica o cache em memória primeiro
      if (inMemoryUserCache) {
        setUsers(inMemoryUserCache);
      }

      const cachedUsers = getCache();
      if (cachedUsers) {
        setUsers(cachedUsers);
        inMemoryUserCache = cachedUsers; // Armazena a lista em memória
      }
      const { data, status } = await api.get<Props>("/users");
      if (status === 200) {
        setUsers(data);
        clearCache();
        if (data.length > 0) {
          inMemoryUserCache = data;
          setCache(data);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      const { status } = await api.delete(`/users/${user?.id}`);
      if (status === 204) {
        toast.success(
          `${user?.isManager ? "Gerente" : "Supervisor"} excluído com sucesso!`
        );
        setIsModalOpen(false); // Fecha o modal
        if (user?.id === currentUser?.id) {
          clearCache();
          signOut();
          navigate("/login");
        }
        fetchUsers();
      }
    } catch (error) {
      console.log(`Erro ao deletar usuário: ${error}`);
      setIsErrorDeletion(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    socket.on("create-user", (user: UserProps) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });
    socket.on("update-user", (updatedUser: UserProps) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    });
    socket.on("delete-user", (deletedUser: UserProps) => {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deletedUser.id)
      );
    });

    return () => {
      socket.off("create-user");
      socket.off("update-user");
      socket.off("delete-user");
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <DefaultLayout>
        <header className="grid grid-cols-[50%_50%] items-center justify-between">
          <div className="flex flex-row items-center gap-6">
            <div className="flex flex-row items-center gap-3">
              <UsersRound className="size-6 fill-black" />
              <h1 className="text-lg font-bold whitespace-nowrap">
                Painel de Usuários
              </h1>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {isPageLoading
                ? "Carregando..."
                : `${users.length} usuários cadastrados.`}
            </p>
          </div>
          <div className="flex flex-row items-center gap-5">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder=" Buscar"
                className="pl-10 rounded-2xl bg-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {currentUser?.isManager && (
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-2xl"
                onClick={() => {
                  setUser(null);
                  setIsUserModalOpen(true);
                }}
              >
                <Plus />
                <span>Adicionar Usuário</span>
              </Button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-y-4 gap-x-3 py-4 w-full">
              {isPageLoading ? (
                <Loading amountCards={6} heightRem={28} />
              ) : (
                filteredUsers.map((data) => (
                  <UserCard
                    user={data}
                    key={data.id}
                    isOnline={onlineUsers.includes(data.id!)}
                    onDelete={() => {
                      setUser(data); // Define o usuario a ser deletado
                      setIsModalOpen(true); // Abre o modal
                    }}
                    onUpdate={() => {
                      setUser(data);
                      setIsUserModalOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
      {/* User Forms Modal */}
      <UserModal
        user={user}
        modal={{ isOpen: isUserModalOpen, setIsOpen: setIsUserModalOpen }}
        fetchUsers={fetchUsers}
      />
      {/* Delete Confirmation Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
          setIsErrorDeletion(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isErrorDeletion
                ? "Falha ao tentar excluir o usário"
                : "Excluir Usuário"}
            </DialogTitle>
            <DialogDescription>
              {isErrorDeletion
                ? "Não foi possível excluir o usuário (verifique a sua conexão ou tente mais tarde)."
                : `Você tem certeza que deseja deletar excluir o usuário
              "${user?.name}" do sistema?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={handleDeleteUser}
              disabled={isLoading}
            >
              {isLoading
                ? "Deletando..."
                : isErrorDeletion
                ? "Tentar novamente"
                : "Sim"}
            </Button>
            <Button
              variant={"default"}
              onClick={() => {
                setIsModalOpen(false);
                setIsErrorDeletion(false);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ErrorDialog
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        action="carregar usuários"
      />
    </>
  );
}
