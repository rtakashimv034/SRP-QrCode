import { Route, Routes } from "react-router";
import { ForgotPassword } from "./components/ForgotPassword";
import { Login } from "./components/pages/Login";
import { NotFound } from "./components/pages/NotFound";
import { Presentation } from "./components/pages/Presentation";
import { Reports } from "./components/pages/Reports";
import { Sectors } from "./components/pages/Sectors";
import { Users } from "./components/pages/Users";
import { TrayManagment } from "./components/TrayManagment";

function App() {
  return (
    <Routes>
      <Route index element={<Presentation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/sectors" element={<Sectors />} />
      <Route path="/users" element={<Users />} />
      <Route path="/tray-managment" element={<TrayManagment />} />
      <Route path="/retrive-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
