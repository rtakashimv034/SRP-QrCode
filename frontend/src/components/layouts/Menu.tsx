import { Factory, LogOut, StickyNote, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function Menu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="bg-white flex flex-col items-center justify-between p-8">
      <div className="flex flex-col gap-5 w-full">
        <Button
          variant={pathname.includes("reports") ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all ${
            pathname.includes("reports") &&
            "first:child:hover:text-yellow-light"
          }`}
          onClick={() => navigate("/reports")}
        >
          <StickyNote
            className={`size-7 ${
              pathname.includes("reports")
                ? "fill-white text-yellow-dark"
                : "text-white fill-black"
            }`}
          />
          <span className="font-normal">Relatórios</span>
        </Button>
        <Button
          variant={pathname.includes("/sectors") ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all ${
            pathname.includes("/sectors") &&
            "first:child:hover:text-yellow-light"
          }`}
          onClick={() => navigate("/sectors")}
        >
          <Factory
            className={`size-7 ${
              pathname.includes("/sectors")
                ? "fill-white text-yellow-dark"
                : "text-white fill-black"
            }`}
          />
          <span className="font-normal">Setores</span>
        </Button>
        <Button
          variant={pathname.includes("/users") ? "submit" : "outline"}
          className={`justify-start px-2 child:font-normal child:transition-all`}
          onClick={() => navigate("/users")}
        >
          <UsersRound
            className={`size-7 ${
              pathname.includes("/users")
                ? "fill-white text-white"
                : "fill-black text-black"
            }`}
          />
          <span className="font-normal">Usuários</span>
        </Button>
      </div>
      <div className="flex w-full">
        <Button
          variant={"transparent"}
          className="opacity-70 hover:opacity-100 transition-all"
          onClick={() => navigate("/login")}
        >
          <LogOut /> Sair
        </Button>
      </div>
    </div>
  );
}
