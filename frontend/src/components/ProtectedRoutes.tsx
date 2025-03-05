import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  isSupervisor?: boolean;
};

export function ProtectedRoutes({ children, isSupervisor = false }: Props) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  if (isSupervisor && userRole === "supervisor") {
    return <Navigate to={"/create-sector"} replace />;
  }

  return <>{children}</>;
}
