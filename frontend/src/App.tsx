import { Navigate, Route, Routes, useLocation } from "react-router";
import { AuthProvider } from "./auth/AuthProvider";
import { ForgotPassword } from "./components/ForgotPassword";
import { CreateSector } from "./components/pages/CreateSector";
import { EditSector } from "./components/pages/EditSector";
import { Login } from "./components/pages/Login";
import { NotFound } from "./components/pages/NotFound";
import { Reports } from "./components/pages/Reports";
import { Sectors } from "./components/pages/Sectors";
import { Users } from "./components/pages/Users";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { TrayManagment } from "./components/TrayManagment";

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
          path="/sectors/:name"
          element={
            <ProtectedRoutes previousPath="/sectors">
              <EditSector />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoutes>
              <Users />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tray-managment"
          element={
            <ProtectedRoutes>
              <TrayManagment />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/retrive-password"
          element={
            <ProtectedRoutes>
              <ForgotPassword />
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
