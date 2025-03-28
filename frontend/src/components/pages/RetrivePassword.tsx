import { api } from "@/api/axios";
import logo from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { ErrorDialog } from "../ErrorDialog";
import { SuccessDialog } from "../SuccessDialog";

const adminEmail = "admin@gmail.com";

const retrivePasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type RetrivePasswordFormValues = z.infer<typeof retrivePasswordSchema>;

export function RetrivePassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RetrivePasswordFormValues>({
    resolver: zodResolver(retrivePasswordSchema),
    mode: "onSubmit",
  });

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const email = watch("email");

  const onSubmit = async ({ email }: RetrivePasswordFormValues) => {
    try {
      if (email !== adminEmail) {
        await api.post("auth/forgot-password", { email });
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha", error);
      setIsErrorModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex overflow-hidden items-center justify-center h-screen bg-img bg-transparent bg-[100%] bg-cover bg-no-repeat">
        <Card className="flex p-32 flex-col justify-center items-center w-2/3 md:w-[40%] h-[90%] bg-white/25 bg-no-repeat backdrop-blur-[11px] border-none">
          <CardHeader className="flex w-full">
            <img
              src={logo}
              className="bg-transparent w-full h-36 text-4xl italic flex justify-center items-center"
            ></img>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-3">
            <h2 className="text-white text-2xl font-bold">
              Recuperação de Senha
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full flex flex-col items-end"
            >
              <div className="w-full space-y-1">
                <Input
                  type="email"
                  {...register("email", { required: "E-mail é obrigatório" })}
                  placeholder="Digite seu e-mail"
                  className="bg-white text-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <p className="text-white text-xs">
                  Digite seu e-mail cadastrado para receber as instruções de
                  recuperação de senha.
                </p>
              </div>
              <div className="flex items-center w-full justify-between mt-4">
                <span
                  className="text-white text-sm hover:cursor-pointer opacity-70 underline hover:opacity-90"
                  onClick={() => navigate("/login")}
                >
                  Voltar para login
                </span>
                <Button
                  type="submit"
                  variant={"submit"}
                  className="rounded-full px-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <ErrorDialog
        action="solicitar recuperação de senha"
        additionalText={
          email === adminEmail
            ? "Não é permitido alterar a senha da conta admin."
            : "Verifique se o e-mail está correto e tente novamente."
        }
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
      />
      <SuccessDialog
        title="E-mail enviado com sucesso!"
        message="Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
        isOpen={isSuccessModalOpen}
        setIsOpen={setIsSuccessModalOpen}
        onClose={() => navigate("/login")}
      />
    </>
  );
}
