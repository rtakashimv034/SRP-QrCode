import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function Presentation() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-evenly items-center">
      <h1 className="font-bold text-8xl mt-[-8rem]">SRP Qrcode</h1>
      <Button
        className="py-6 px-10 text-2xl"
        onClick={() => navigate("/login")}
      >
        Get Started
      </Button>
    </div>
  );
}
