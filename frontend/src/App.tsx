import { Route, Routes } from "react-router";
import { ForgotPassword } from "./components/ForgotPassword";
import { CreateSector } from "./components/pages/CreateSector";
import { EditSector } from "./components/pages/EditSector";
import { Login } from "./components/pages/Login";
import { NotFound } from "./components/pages/NotFound";
import { Presentation } from "./components/pages/Presentation";
import { Reports } from "./components/pages/Reports";
import { Sectors } from "./components/pages/Sectors";
import { Users } from "./components/pages/Users";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { TrayManagment } from "./components/TrayManagment";
import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Presentation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route
          path="/sectors/create-sector"
          element={
            <ProtectedRoutes path="/sectors">
              <CreateSector />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sectors/edit-sector/:name" // Rota dinâmica para edição
          element={
            <ProtectedRoutes path="/sectors">
              <EditSector />
            </ProtectedRoutes>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/tray-managment" element={<TrayManagment />} />
        <Route path="/retrive-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
