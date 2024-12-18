import { useNavigate } from "react-router-dom";
import { CardDescription, CardTitle } from "./ui/card";

type Props = {
  title: string;
  path: string;
  registereds?: number;
  associateds?: number;
  hasAssociation?: boolean;
};

export function CardHome({
  path,
  associateds,
  registereds,
  title,
  hasAssociation = false,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      className=" cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[150px] hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200"
      onClick={() => navigate(`${path}`)}
    >
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>
        <p>Totais Cadastrados: {registereds}</p>
        {hasAssociation && <p>Totais Associados: {associateds}</p>}
      </CardDescription>
    </div>
  );
}
