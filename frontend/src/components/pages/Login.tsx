import logo from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { ErrorDialog } from "../ErrorDialog";
import { PasswordField } from "../ui/passwordfield";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    try {
      await signIn(email, password);
      navigate("/reports");
    } catch (error) {
      console.error("Erro ao realizar login", error);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex overflow-hidden items-center justify-start h-screen bg-img-calliu bg-transparent bg-[100%] bg-cover bg-no-repeat">
        <Card className="flex p-32 flex-col ml-32 justify-center items-center w-2/3 md:w-[40%] h-[90%] bg-white/25 bg-no-repeat backdrop-blur-[11px] border-none">
          <CardHeader className="flex w-full">
            <img
              src={logo}
              className="bg-transparent w-full h-36 text-4xl italic flex justify-center items-center"
            />
          </CardHeader>
          <CardContent className="w-full mt-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full flex flex-col items-end"
            >
              <div className="w-full space-y-4">
                <Input
                  type="email"
                  {...register("email", { required: "E-mail é obrigatório" })}
                  className={`bg-white text-black ${
                    errors.email &&
                    "placeholder:text-sm placeholder:text-red-500"
                  }`}
                  placeholder={
                    errors.email ? errors.email.message : "Digite seu e-mail"
                  }
                />
                <PasswordField
                  {...register("password", { required: "Senha é obrigatória" })}
                  className={`bg-white text-black ${
                    errors.password &&
                    "placeholder:text-sm placeholder:text-red-500"
                  }`}
                  placeholder={
                    errors.password
                      ? errors.password.message
                      : "Digite a sua senha"
                  }
                />
              </div>
              <div className="flex items-center w-full justify-end">
                <span
                  onClick={() => navigate("/retrive-password")}
                  className="text-white opacity-70 underline text-xs cursor-pointer hover:opacity-90"
                >
                  Esqueceu a senha?
                </span>
              </div>
              <Button
                type="submit"
                variant={"submit"}
                className="rounded-full px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ErrorDialog
        action="realizar login"
        additionalText="E-mail ou senha inválidos."
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </>
  );
}
