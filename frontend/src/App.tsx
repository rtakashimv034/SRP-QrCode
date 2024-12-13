import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Presentation } from "./components/Presentation";

function App() {
  return (
    <Routes>
      <Route index element={<Presentation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
