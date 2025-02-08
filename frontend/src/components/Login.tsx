import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

import { PasswordField } from "./ui/passwordfield";
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  // TODO:
  // - fields validation
  // - fix Styles
  // - implements logic
  const handleLogin = () => {
    console.log("email:", email);
    console.log("Password:", password);
    navigation("/home");
  };

  return (
    <div className="flex overflow-hidden items-center justify-center h-screen bg-[url(@/assets/bg.png)] bg-transparent bg-[100%] bg-cover bg-no-repeat">
      <Card className="flex p-32 flex-col justify-center items-center w-2/3 md:w-[40%] h-[90%] bg-white/25 bg-no-repeat backdrop-blur-[11px] border-none">
        <CardHeader className="w-full">
          <div className="bg-white w-fill h-36 text-4xl italic flex justify-center items-center">
            LOGO
          </div>
        </CardHeader>
        <CardContent className="w-full mt-8">
          <div className="w-full space-y-4">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Login"
              required
              className="bg-white text-black"
            />
            <PasswordField
              id="password"
              value={password}
              placeholder="Senha"
              className="bg-white"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col w-full space-y-6 items-end">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-2">
              <Checkbox className="border-none bg-white " />
              <span className="text-white opacity-75 text-xs">
                Manter-me conectado
              </span>
            </div>
            <span
              onClick={() => navigation("/retrive-password")}
              className="text-white opacity-70 underline text-xs cursor-pointer hover:opacity-90"
            >
              Esqueceu a senha?
            </span>
          </div>
          <Button
            className="rounded-full px-6"
            variant={"submit"}
            disabled={!email || !password}
            onClick={handleLogin}
            type="submit"
          >
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
