import { api } from "@/api/axios";
import { AuthSplashScreen } from "@/components/AuthSplashScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext, AuthContextData, UserPayload } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState<AuthContextData["user"]>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/login", { email, password });
      const { token } = data;

      localStorage.setItem("authToken", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userJWT: UserPayload = jwtDecode(token);
      setUser(userJWT);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Email ou senha inválidos");
    }
  };

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    api.defaults.headers.authorization = "";
  };

  useEffect(() => {
    const fetchUserData = async ({ id }: UserPayload) => {
      try {
        const { data } = await api.get<UserPayload>(`/users/${id}`);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        signOut(); // If we can't fetch user data, sign out
      }
    };

    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("token não existe");
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const userJWT: UserPayload = jwtDecode(token);
        await fetchUserData(userJWT);
      } catch (error) {
        console.error("Error initializing auth:", error);
        signOut();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  if (loading) {
    const loginSplash =
      localStorage.getItem("authToken") && !(pathname === "/login");
    return loginSplash ? <SplashScreen /> : <AuthSplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext } from "./context";
