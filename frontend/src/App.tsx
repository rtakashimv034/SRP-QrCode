import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { CreateSector } from "./components/pages/CreateSector";
import { Login } from "./components/pages/Login";
import { NotFound } from "./components/pages/NotFound";
import { Products } from "./components/pages/Products";
import { Reports } from "./components/pages/Reports";
import { ResetPassword } from "./components/pages/ResetPassword";
import { RetrivePassword } from "./components/pages/RetrivePassword";
import { Sectors } from "./components/pages/Sectors";
import { Users } from "./components/pages/Users";

function App() {
  const { pathname } = useLocation();

  // Redirect to /login if the path is "/"
  if (pathname === "/") {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/retrive-password" element={<RetrivePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/reports"
          element={
            <ProtectedRoutes>
              <Reports />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoutes>
              <Products />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sectors"
          element={
            <ProtectedRoutes>
              <Sectors />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sectors/create-sector"
          element={
            <ProtectedRoutes previousPath="/sectors">
              <CreateSector />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoutes previousPath="/reports">
              <Users />
            </ProtectedRoutes>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-right" // Posição do toast (top-right, top-center, bottom-right, etc.)
        toastOptions={{
          duration: 2000, // Duração padrão (3 segundos)
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
