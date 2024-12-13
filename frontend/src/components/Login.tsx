import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  // TODO:
  // - fields validation
  // - fix Styles
  // - implements logic
  const handleLogin = () => {
    console.log("CPF:", cpf);
    console.log("Password:", password);
    navigation("/home");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <Card className="w-96">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold text-slate-800">Login</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-slate-700"
              >
                CPF
              </label>
              <Input
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite seu CPF"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button className="w-full" variant={"submit"} onClick={handleLogin}>
            Logar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
