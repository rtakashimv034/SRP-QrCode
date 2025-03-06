import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  isManager?: boolean;
};

export function ProtectedRoutes({ children, isManager = false }: Props) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  if (isManager && userRole === "supervisor") {
    return <Navigate to={"/create-sector"} replace />;
  }

  return <>{children}</>;
}
