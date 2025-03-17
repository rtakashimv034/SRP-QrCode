import { createContext } from "react";

export type UserPayload = {
  id: string;
  name: string;
  surName: string;
  avatar: string | null;
  isManager: boolean;
  email: string;
};

export interface AuthContextData {
  user: UserPayload | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
