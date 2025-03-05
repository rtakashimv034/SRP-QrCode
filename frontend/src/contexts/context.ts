import { createContext } from "react";

interface User {
  id: string;
  name: string;
  surName: string;
  avatar: string | null;
  email: string;
  isSupervisor: boolean;
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isSupervisor: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
