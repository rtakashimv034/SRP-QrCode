import { Factory, LogOut, StickyNote, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function Menu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex flex-col items-center justify-between p-8">
      <div className="flex flex-col gap-5 w-full">
        <Button
          variant={pathname === "/reports" ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all ${
            pathname === "/reports" && "first:child:hover:text-yellow-light"
          }`}
          onClick={() => navigate("/reports")}
        >
          <StickyNote
            className={`size-7 fill-${
              pathname === "/reports" ? "white" : "black"
            } text-${pathname === "/reports" ? "yellow-dark" : "white"}`}
          />
          <span className="font-normal">Relatórios</span>
        </Button>
        <Button
          variant={pathname === "/sectors" ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all ${
            pathname === "/sectors" && "first:child:hover:text-yellow-light"
          }`}
          onClick={() => navigate("/sectors")}
        >
          <Factory
            className={`size-7 fill-${
              pathname === "/sectors" ? "white" : "black"
            } text-${pathname === "/sectors" ? "yellow-dark" : "white"}`}
          />
          <span className="font-normal">Setores</span>
        </Button>
        <Button
          variant={pathname === "/users" ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all`}
          onClick={() => navigate("/users")}
        >
          <UsersRound
            className={`size-7 fill-${
              pathname === "/users" ? "white" : "black"
            } text-${pathname === "/users" ? "white" : "black"}`}
          />
          <span className="font-normal">Usuários</span>
        </Button>
      </div>
      <div className="flex w-full">
        <Button
          variant={"transparent"}
          className="opacity-70 hover:opacity-100 transition-all"
          onClick={handleLogout}
        >
          <LogOut /> Sair
        </Button>
      </div>
    </div>
  );
}
