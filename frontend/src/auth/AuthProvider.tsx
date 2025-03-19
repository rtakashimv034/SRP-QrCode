import { api } from "@/api/axios";
import { socket } from "@/api/socket";
import { AuthSplashScreen } from "@/components/AuthSplashScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { User } from "@/types/user";
import { createContext } from "react";

type AuthContextData = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState<AuthContextData["user"]>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, status } = await api.post("/login", { email, password });

      if (status !== 200) {
        throw new Error("Some error occurred while logging in");
      }

      const { token } = data;

      sessionStorage.setItem("authToken", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userJWT: User = jwtDecode(token);
      setUser(userJWT);

      socket.emit("user-online", userJWT.id);

      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Email ou senha inválidos");
    }
  };

  const signOut = () => {
    if (user) {
      socket.emit("user-offline", user.id);
    }
    sessionStorage.clear();
    setUser(null);
    api.defaults.headers.authorization = "";
  };

  useEffect(() => {
    const fetchUserData = async ({ id }: User) => {
      try {
        const { data, status } = await api.get<User>(`/users/${id}`);
        if (status === 200) {
          setUser(data);
          socket.emit("user-online", id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        signOut(); // If we can't fetch user data, sign out
      }
    };

    const initAuth = async () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const userJWT: User = jwtDecode(token);
        await fetchUserData(userJWT);
      } catch (error) {
        console.error("Error initializing auth:", error);
        signOut();
      }
      setLoading(false);
    };
    initAuth();

    // Clean up "user-online" event when component unmounts
    return () => {
      if (user) {
        socket.emit("user-offline", user.id);
      }
    };
  }, []);

  if (loading) {
    const loginSplash =
      sessionStorage.getItem("authToken") && !(pathname === "/login");
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
