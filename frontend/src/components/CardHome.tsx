import { useNavigate } from "react-router-dom";
import { CardTitle } from "./ui/card";

type Props = {
  title: string;
  path: string;
  registereds?: number;
  associateds?: number;
  style?: React.CSSProperties; 
};

export function CardHome({ path, title, style }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer border-2 border-gray-300 rounded-lg p-4 flex-grow min-h-[15px] hover:bg-gray-100 hover:border-blue-500 hover:shadow-lg transform transition-all duration-200"
      onClick={() => navigate(`${path}`)}
      style={{
        top: "348px",
        left: "167px",
        width: "281px",
        height: "44px",
        background: "#F6BF00", 
        borderRadius: "8px",
        opacity: "1",
        ...style, 
      }}
    >
      <CardTitle
        className="text-2xl font-bold"
        style={{ transform: "translateY(-10px) translateX(+40px)", color: "#ffffff"}} 
      >
        {title}
      </CardTitle>
    </div>
  );
}
