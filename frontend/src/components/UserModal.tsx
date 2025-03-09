import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PasswordField } from "./ui/passwordfield";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export type UserProps = {
  id?: string;
  name: string;
  surname?: string;
  email: string;
  password?: string;
  isManager: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UpdateUserProps = Omit<UserProps, "password" | "createdAt">;

type Props = {
  user: UserProps | null;
  modal: ModalProps;
  fetchUsers: () => void;
};

// Schema de validação com Zod
const userSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .refine((value) => value.trim().length >= 3, {
      message: "Espaços não contam como caracteres válidos",
    }),
  surname: z.string().optional(),
  email: z.string().email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserModal({ fetchUsers, modal, user }: Props) {
  const {
    register,
    unregister,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  const [isManager, setIsManager] = useState(user?.isManager || false);

  // Preenche os valores do formulário quando o modal é aberto ou o usuário muda
  useEffect(() => {
    if (modal.isOpen && user) {
      setValue("name", user.name);
      setValue("surname", user.surname);
      setValue("email", user.email);
      unregister("password");
      setIsManager(user.isManager);
    } else if (modal.isOpen && !user) {
      reset();
      setIsManager(false);
    }
  }, [modal.isOpen, user, setValue, reset, unregister]);

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    try {
      if (user) {
        const updateData: UpdateUserProps = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          isManager,
        };
        const { status } = await api.patch(`/users/${user.id}`, updateData);
        if (status === 200) {
          modal.setIsOpen(false);
          fetchUsers();
        }
      } else {
        const createData: UserProps = {
          ...data,
          isManager,
        };
        const { status } = await api.post("/users", createData);
        if (status === 201) {
          modal.setIsOpen(false);
          fetchUsers();
        }
      }
    } catch (error) {
      alert(`Erro ao ${user ? "atualizar" : "criar"} usuário: ${error}`);
      console.error(error);
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.setIsOpen}>
      <DialogContent className="w-1/4 flex flex-col items-center gap-0 overflow-hidden py-0 px-4 border-0">
        <div className="relative w-full h-0" />
        <div className="bg-green-light w-full absolute h-14 flex items-center justify-between px-4 text-white font-bold text-lg">
          <span className="mx-auto">
            {user ? "Atualizar Usuário" : "Adicionar Usuário"}
          </span>
        </div>
        <div className="flex justify-center mt-20">
          <div className="size-36 border-2 border-gray-700 rounded-full p-0 flex items-center justify-center">
            <Camera className="text-gray-700 size-20" />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 w-full">
          <div className="flex gap-2">
            <div className="flex flex-col w-1/2">
              <Label className="text-base font-normal">Nome:</Label>
              <Input
                {...register("name")}
                type="text"
                className="border p-2 rounded-md w-full bg-gray-input"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <Label className="text-base font-normal">Sobrenome:</Label>
              <Input
                {...register("surname")}
                type="text"
                className="border p-2 rounded-md w-full bg-gray-input"
              />
              {errors.surname && (
                <span className="text-red-500 text-sm">
                  {errors.surname.message}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-base font-normal">Email:</Label>
            <Input
              {...register("email")}
              type="email"
              className="border p-2 rounded-md w-full bg-gray-input"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          {!user && (
            <div className="mt-4">
              <Label className="text-base font-normal">Senha:</Label>
              <PasswordField
                {...register("password")}
                placeholder="Set password"
                className="border p-2 rounded-md w-full bg-gray-input"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          )}
          <div className="mt-4">
            <Label className="text-base font-normal ">Permissões:</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                onClick={() => setIsManager(true)}
                className={`${
                  isManager
                    ? "border-yellow-400 text-yellow-400"
                    : "border-gray-600 text-black"
                } border-2 rounded-lg px-4 py-2 bg-transparent hover:bg-gray-100`}
              >
                Administrador
              </Button>
              <Button
                type="button"
                onClick={() => setIsManager(false)}
                className={`${
                  !isManager
                    ? "border-yellow-400 text-yellow-400"
                    : "border-gray-600 text-black"
                } border-2 rounded-lg px-4 py-2 bg-transparent hover:bg-gray-100`}
              >
                Supervisor
              </Button>
            </div>
          </div>
          <div className="flex justify-center gap-4 p-4">
            <Button
              type="button"
              className="border border-gray-600 text-black px-4 py-2 rounded-md bg-transparent hover:bg-gray-100"
              onClick={() => reset()}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {user ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
