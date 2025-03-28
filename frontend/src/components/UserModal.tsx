import { baseURL } from "@/api";
import { api } from "@/api/axios";
import { UserProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorDialog } from "./ErrorDialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PasswordField } from "./ui/passwordfield";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

type Props = {
  user: UserProps | null;
  modal: ModalProps;
  fetchUsers: () => void;
};

// Schema de validação com Zod
const userSchema = z.object({
  name: z
    .string()
    .min(3, "Pelo menos 3 caracteres")
    .refine((value) => value.trim().length >= 3, {
      message: "Espaços são inválidos",
    }),
  surname: z.string().optional(),
  email: z.string().email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .optional(),
  confirmPassword: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserModal({ fetchUsers, modal, user }: Props) {
  const {
    register,
    unregister,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
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

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const [isManager, setIsManager] = useState(user?.isManager || false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [notification, setNotification] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    if (!user && data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "As senhas não coincidem",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("surname", data.surname || "");
      formData.append("email", data.email);
      formData.append("notification", String(notification));
      formData.append("isManager", String(isManager)); // Convertendo para string
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (removeAvatar) {
        formData.append("removeAvatar", "true");
      }
      if (!user && data.password) {
        // Apenas adiciona a senha durante a criação
        formData.append("password", data.password);
      }

      if (user) {
        const { status } = await api.patch(`/users/${user.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (status === 200) {
          modal.setIsOpen(false);
          fetchUsers();
          window.location.reload();
        }
      } else {
        const { status } = await api.post("/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (status === 201) {
          modal.setIsOpen(false);
          fetchUsers();
        }
      }
    } catch (error) {
      console.error(
        `Erro ao ${user ? "atualizar" : "criar"} usuário: ${error}`
      );
      setIsErrorModalOpen(true);
    }
  };

  useEffect(() => {
    if (!user && password && confirmPassword && password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "As senhas não coincidem",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [password, confirmPassword, user, setError, clearErrors]);

  // Preenche os valores do formulário quando o modal é aberto ou o usuário muda
  useEffect(() => {
    if (modal.isOpen && user) {
      setValue("name", user.name);
      setValue("surname", user.surname);
      setValue("email", user.email);
      unregister("password");
      setIsManager(user.isManager);
      if (user.avatar) {
        setAvatarPreview(`${baseURL}/uploads/${user.avatar}`);
      } else {
        setAvatarPreview(null);
      }
      setRemoveAvatar(false);
    } else if (modal.isOpen && !user) {
      reset();
      setIsManager(false);
      setAvatarPreview(null);
      setRemoveAvatar(false);
    }
  }, [modal.isOpen, user, setValue, reset, unregister]);

  return (
    <>
      <Dialog open={modal.isOpen} onOpenChange={modal.setIsOpen}>
        <DialogContent className="w-1/4 flex flex-col items-center gap-0 overflow-hidden py-0 px-4 border-0">
          <div className="relative w-full h-0" />
          <div className="bg-green-light w-full absolute h-14 flex items-center justify-between px-4 text-white font-bold text-lg">
            <span className="mx-auto">
              {user ? "Atualizar Usuário" : "Adicionar Usuário"}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-2 items-center mt-16">
            <div className="size-36 border-2 border-gray-700 hover:border-gray-500 child:hover:text-gray-500 transition-all child:transition-all relative rounded-full p-0 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="size-[8.5rem] rounded-full"
                />
              ) : (
                <Camera className="text-gray-700 size-20" />
              )}
              <input
                id="avatarInput"
                type="file"
                className="absolute size-36 hover:cursor-pointer rounded-full opacity-0"
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
              />
            </div>
            {avatarPreview && (
              <Button
                className="px-3 bg-transparent border border-black opacity-70 rounded-2xl h-5 text-[10px] hover:bg-red-300"
                onClick={() => {
                  setAvatarPreview(null);
                  setRemoveAvatar(true);
                }}
              >
                <Trash2 className="text-black size-3" />
                <span className="text-black font-normal">Remover Avatar</span>
              </Button>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 w-full">
            <div className="flex mt-4 gap-2">
              <div className="flex flex-col w-1/2">
                <Label className="text-base font-normal">Nome *</Label>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder={errors.name ? errors.name.message : "Pedro"}
                  className={`border p-2 rounded-md w-full bg-gray-input ${
                    errors.name &&
                    "placeholder:text-red-500 placeholder:text-xs"
                  }`}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <Label className="text-base font-normal">Sobrenome</Label>
                <Input
                  {...register("surname")}
                  type="text"
                  placeholder="Yutaro"
                  className="border p-2 rounded-md w-full bg-gray-input"
                />
              </div>
            </div>

            <div className="mt-1 gap-2 flex flex-col">
              <Label className="text-base font-normal">Email *</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder={
                  errors.email ? errors.email.message : "exemplo@gmail.com"
                }
                className={`border p-2 rounded-md w-full bg-gray-input ${
                  errors.email && "placeholder:text-red-500 placeholder:text-xs"
                }`}
              />
              {!user && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 hover:cursor-pointer rounded-full"
                    checked={notification}
                    onChange={() => setNotification(!notification)}
                  />
                  <span className="text-xs text-gray-700">
                    Mandar notificação de cadastro ao email inserido
                  </span>
                </div>
              )}
            </div>
            {!user && (
              <>
                <div className="mt-2">
                  <Label className="text-base font-normal">Senha *</Label>
                  <PasswordField
                    {...register("password")}
                    placeholder={
                      errors.password
                        ? errors.password.message
                        : "Min 8 caracteres"
                    }
                    className={`border p-2 rounded-md w-full bg-gray-input ${
                      errors.password &&
                      "placeholder:text-red-500 placeholder:text-xs"
                    }`}
                  />
                </div>
                {watch("password") && (
                  <div className="mt-1">
                    <Label className="text-base font-normal">
                      Confirmar senha *
                    </Label>
                    <PasswordField
                      {...register("confirmPassword")}
                      placeholder="Confirme sua senha"
                      className={`border p-2 rounded-md w-full bg-gray-input ${
                        errors.confirmPassword &&
                        "placeholder:text-red-500 placeholder:text-xs"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <span className="text-red-500 text-xs">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="mt-2">
              <Label className="text-base font-normal ">Permissões *</Label>
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
                  Gerente
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
                onClick={() => {
                  reset();
                  setAvatarPreview(null);
                  setRemoveAvatar(true);
                  if (!user) {
                    setValue("confirmPassword", "");
                  }
                }}
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
      <ErrorDialog
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        action={`${user ? "atualizar" : "criar"} usuário`}
        additionalText="Usuário já consta no sistema."
      />
    </>
  );
}
