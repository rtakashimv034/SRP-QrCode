import { api } from "@/api";
import { useEffect, useState } from "react";
import { AuthContext, AuthContextData } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextData["user"]>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Fetch user data from API
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      signOut(); // If we can't fetch user data, sign out
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/login", { email, password });
      const { token, user } = data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Email ou senha inválidos");
    }
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
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
