import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Presentation } from "./components/Presentation";
import {GerenciarCamera} from "./components/GerenciarCamera";
import { GerenciarEstacao } from "./components/GerenciarEstacao";
import { GerenciarBandeja } from "./components/GerenciarBandeja";

function App() {
  return (
    <Routes>
      <Route index element={<Presentation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/gerenciarCamera" element={<GerenciarCamera/>} />
      <Route path="/gerenciarEstacao" element={<GerenciarEstacao/>} />
      <Route path="/gerenciarBandeja" element={<GerenciarBandeja/>} />
    </Routes>
  );
}

export default App;
