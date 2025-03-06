import { createContext } from "react";

interface User {
  id: string;
  name: string;
  surName: string;
  avatar: string | null;
  email: string;
  isManager: boolean;
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isManager: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
