import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import { useAuth } from "@/hooks/useAuth";
import { useCache } from "@/hooks/useCache";
import { Plus, Search, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCard } from "../cards/UserCard";
import { DefaultLayout } from "../layouts/DefaultLayout";
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
import { UserModal, UserProps } from "../UserModal";

type Props = UserProps[];

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
  const { isManager } = useAuth();
  const { user: currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const { data, status } = await api.get<Props>("/users");
      if (status === 200) {
        setUsers(data);
        setCache(data);
      }

      const cachedUsers = getCache();
      if (cachedUsers) {
        setUsers(cachedUsers);
      }
    } catch (error) {
      alert(`Erro ao deletar usuário: ${error}`);
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      const { status } = await api.delete(`/users/${user?.id}`);
      if (status === 204) {
        setIsModalOpen(false); // Fecha o modal
        fetchUsers(); // Atualiza a lista de usuários
        if (user?.id === currentUser?.id) {
          clearCache();
          signOut();
          navigate("/");
        }
      }
    } catch (error) {
      alert(`Erro ao deletar usuário: ${error}`);
      console.log(error);
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
            {users.length} usuários cadastrados.
          </p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder=" Buscar"
              className="pl-10 rounded-2xl bg-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isManager && (
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
            {filteredUsers.map((user) => (
              <UserCard
                user={user}
                key={user.id}
                onDelete={() => {
                  setUser(user); // Define o usuario a ser deletado
                  setIsModalOpen(true); // Abre o modal
                }}
                onUpdate={() => {
                  setUser(user);
                  setIsUserModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* User Forms Modal */}
      <UserModal
        user={user}
        modal={{ isOpen: isUserModalOpen, setIsOpen: setIsUserModalOpen }}
        fetchUsers={fetchUsers}
      />
      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar excluir o usuário "
              {user?.name}" do sistema?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={handleDeleteUser}
              disabled={isLoading}
            >
              {isLoading ? "Deletando..." : "Sim"}
            </Button>
            <Button variant={"default"} onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
}
