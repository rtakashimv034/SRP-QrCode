import { api } from "@/api/axios";
import logo from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as z from "zod";
import { ErrorDialog } from "../ErrorDialog";
import { SuccessDialog } from "../SuccessDialog";
import { PasswordField } from "../ui/passwordfield";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    setToken(tokenParam);

    // Opcional: Verificar com backend se o token é válido
    if (tokenParam) {
      verifyToken(tokenParam);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      // Chamada opcional para verificar o token antes de mostrar o formulário
      await api
        .post("auth/verify-reset-token", { token })
        .then(() => setIsValidToken(true))
        .catch(() => setIsValidToken(false));
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      setIsValidToken(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await api.post("auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Erro ao redefinir senha");
      setIsErrorModalOpen(true);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-img bg-[100%] bg-cover bg-no-repeat text-4xl text-white font-bold">
        Verificando token...
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-img bg-[100%] bg-cover bg-no-repeat">
        <Card className="p-8 max-w-md bg-white/25 backdrop-blur-md border-none">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Link inválido ou expirado!
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4 text-white font-light">
              O link de redefinição de senha é inválido ou expirou.
            </p>
            <Button
              variant={"submit"}
              onClick={() => navigate("/retrive-password")}
              className="w-full"
            >
              Solicitar novo link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex overflow-hidden items-center justify-center h-screen bg-img bg-transparent bg-[100%] bg-cover bg-no-repeat">
        <Card className="flex p-32 flex-col justify-center items-center w-2/3 md:w-[40%] h-[90%] bg-white/25 bg-no-repeat backdrop-blur-[11px] border-none">
          <CardHeader className="flex w-full">
            <img
              src={logo}
              className="bg-transparent w-full h-36 text-4xl italic flex justify-center items-center"
              alt="Logo"
            />
          </CardHeader>
          <CardContent className="w-full mt-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              Redefinir Senha
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <div className="w-full space-y-4">
                <PasswordField
                  {...register("newPassword", {
                    required: "Senha é obrigatória",
                  })}
                  className={`bg-white text-black ${
                    errors.newPassword &&
                    "placeholder:text-sm placeholder:text-red-500"
                  }`}
                  placeholder={
                    errors.newPassword
                      ? errors.newPassword.message
                      : "Nova senha"
                  }
                />
                <div className="flex flex-col gap-1">
                  <PasswordField
                    {...register("confirmPassword")}
                    placeholder="Confirme a nova senha"
                    className="bg-white text-black"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 font-semibold text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                variant={"submit"}
                className="rounded-full px-6 w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <ErrorDialog
        action="redefinir senha"
        additionalText={errorMessage}
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
      />

      <SuccessDialog
        title="Senha redefinida com sucesso!"
        message="Você já pode fazer login com sua nova senha."
        isOpen={isSuccessModalOpen}
        setIsOpen={setIsSuccessModalOpen}
        onClose={() => navigate("/login")}
      />
    </>
  );
}
