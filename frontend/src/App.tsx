import { Navigate, Route, Routes, useLocation } from "react-router";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { CreateSector } from "./components/pages/CreateSector";
import { Login } from "./components/pages/Login";
import { NotFound } from "./components/pages/NotFound";
import { Products } from "./components/pages/Products";
import { Reports } from "./components/pages/Reports";
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
    </AuthProvider>
  );
}

export default App;
