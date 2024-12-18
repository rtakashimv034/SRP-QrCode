import { useNavigate } from "react-router-dom";
import { CardDescription, CardTitle } from "./ui/card";

type Props = {
  title: string;
  path: string;
  registereds?: number;
  associateds?: number;
};

export function CardHome({ path, associateds, registereds, title }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className=" cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px] hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200"
      onClick={() => navigate(`${path}`)}
    >
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>
        {registereds != null && <p>Totais Cadastrados: {registereds}</p>}
        {associateds != null && <p>Totais Associados: {associateds}</p>}
      </CardDescription>
    </div>
  );
}
