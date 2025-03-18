import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";
import { AuthSplashScreen } from "./AuthSplashScreen";

type Props = {
  children: React.ReactNode;
  previousPath?: string;
};

export function ProtectedRoutes({ children, previousPath }: Props) {
  const { user } = useAuth();

  const token = sessionStorage.getItem("authToken");
  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  if (!user) {
    return <AuthSplashScreen />;
  }

  if (!user?.isManager && previousPath) {
    return <Navigate to={previousPath} replace />;
  }

  return <>{children}</>;
}
