import { api } from "@/api";
import { useEffect, useState } from "react";
import { AuthContext, AuthContextData } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextData["user"]>(null);

  useEffect(() => {
    // Verifica se já existe um token salvo
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/login", { email, password });
      const { token, user } = data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(`user: ${JSON.stringify(user)}`);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Email ou senha inválidos");
    }
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    api.defaults.headers.authorization = "";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSupervisor: user?.isSupervisor || false,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext } from "./context";
