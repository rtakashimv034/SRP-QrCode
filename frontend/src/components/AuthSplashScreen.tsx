import { Factory } from "lucide-react";

export function AuthSplashScreen() {
  return (
    <div className="w-screen h-screen bg-default flex items-center justify-center p-20">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        {/* Logo e título */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2 w-full text-center">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
          </div>
        </div>

        {/* Campos do formulário com efeito de loading */}
        <div className="space-y-6">
          {/* Campo de email */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div
              className="h-10 bg-gray-200 rounded animate-pulse w-full"
              style={{ animationDelay: "0.1s" }}
            />
          </div>

          {/* Campo de senha */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div
              className="h-10 bg-gray-200 rounded animate-pulse w-full"
              style={{ animationDelay: "0.2s" }}
            />
          </div>

          {/* Botão de login */}
          <div
            className="h-10 bg-yellow-400/50 rounded animate-pulse w-full"
            style={{ animationDelay: "0.3s" }}
          />

          {/* Links */}
          <div className="flex justify-between mt-4">
            <div
              className="h-4 bg-gray-200 rounded animate-pulse w-24"
              style={{ animationDelay: "0.4s" }}
            />
            <div
              className="h-4 bg-gray-200 rounded animate-pulse w-24"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
