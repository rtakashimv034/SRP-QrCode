import { api } from "@/api";
import { AuthSplashScreen } from "@/components/AuthSplashScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext, AuthContextData } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState<AuthContextData["user"]>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchUserData = async (userId: string) => {
    try {
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      signOut(); // If we can't fetch user data, sign out
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          await fetchUserData(userId);
        } catch (error) {
          console.error("Error initializing auth:", error);
          signOut();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  if (loading) {
    const loginSplash =
      !localStorage.getItem("authToken") &&
      (pathname === "/" || pathname === "/login");
    return loginSplash ? <SplashScreen /> : <AuthSplashScreen />;
  }

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
