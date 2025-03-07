import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import { Input } from "./input";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  id?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ placeholder, id, ...rest }, ref) => {
    const [isView, setIsView] = useState(false);

    return (
      <div className="relative">
        <Input
          type={isView ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          ref={ref} // Adiciona o ref corretamente
          {...rest}
        />
        {isView ? (
          <Eye
            size={22}
            className="absolute right-[10px] top-[7.5px] z-10 cursor-pointer text-gray-400 hover:text-gray-600 transition-all"
            onClick={() => setIsView(!isView)}
          />
        ) : (
          <EyeOff
            size={22}
            className="absolute right-[10px] top-[7.5px] z-10 cursor-pointer text-gray-400 hover:text-gray-600 transition-all"
            onClick={() => setIsView(!isView)}
          />
        )}
      </div>
    );
  }
);

// Define um display name para evitar avisos no React DevTools
PasswordField.displayName = "PasswordField";

export { PasswordField };
