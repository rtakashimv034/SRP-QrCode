import { Factory, LogOut, StickyNote, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function Menu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isReports = pathname === "/reports";
  const isSectors =
    pathname === "/sectors" || pathname === "/sectors/create-sector";
  const isUsers = pathname === "/users";

  return (
    <div className="bg-white flex flex-col items-center justify-between p-8">
      <div className="flex flex-col gap-5 w-full">
        <Button
          variant={isReports ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all ${
            isReports && "first:child:hover:text-yellow-light"
          }`}
          onClick={() => navigate("/reports")}
        >
          <StickyNote
            className={`size-7 ${
              isReports
                ? "fill-white text-yellow-dark"
                : "text-white fill-black"
            }`}
          />
          <span className="font-normal">Relatórios</span>
        </Button>
        <Button
          variant={isSectors ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all ${
            isSectors && "first:child:hover:text-yellow-light"
          }`}
          onClick={() => navigate("/sectors")}
        >
          <Factory
            className={`size-7 ${
              isSectors
                ? "fill-white text-yellow-dark"
                : "text-white fill-black"
            }`}
          />
          <span className="font-normal">Setores</span>
        </Button>
        <Button
          variant={isUsers ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all`}
          onClick={() => navigate("/users")}
        >
          <UsersRound
            className={`size-7 ${
              isUsers ? "fill-white text-white" : "fill-black text-black"
            }`}
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
