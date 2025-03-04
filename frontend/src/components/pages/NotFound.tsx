import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-yellow-700 to-yellow-400">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl">Page Not Found</p>
        <p className="mt-2 mb-20">
          Sorry, the page you are looking for does not exist.
        </p>
        <Button onClick={() => navigate(-1)}>Back to previous page</Button>
      </div>
    </div>
  );
}
