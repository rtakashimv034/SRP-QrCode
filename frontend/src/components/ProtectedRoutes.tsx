import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  path: string;
};

export function ProtectedRoutes({ children, path }: Props) {
  const { isManager } = useAuth();

  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  if (!isManager) {
    return <Navigate to={path} replace />;
  }

  return <>{children}</>;
}
