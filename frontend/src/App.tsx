import { Route, Routes } from "react-router";
import { CameraManagment } from "./components/CameraManagment";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { Presentation } from "./components/Presentation";
import { StationManagment } from "./components/StationManagment";
import { TrayManagment } from "./components/TrayManagment";

function App() {
  return (
    <Routes>
      <Route index element={<Presentation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/camera-managment" element={<CameraManagment />} />
      <Route path="/station-managment" element={<StationManagment />} />
      <Route path="/tray-managment" element={<TrayManagment />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
