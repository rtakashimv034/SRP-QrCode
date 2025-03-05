import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";

export function CreateSector() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="grid grid-cols-[50%_50%] items-center justify-between">
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-row items-center gap-1">
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="size-7  text-black hover:cursor-pointer"
            />
            <h1 className=" text-2xl font-bold  whitespace-nowrap">
              Cadastrar Setor
            </h1>
          </div>
        </div>
      </div>
      <div className="">main</div>
    </DefaultLayout>
  );
}
