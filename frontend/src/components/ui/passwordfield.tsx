import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "./input";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

const PasswordField = ({ placeholder, ...rest }: PasswordFieldProps) => {
  const [isView, setIsView] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isView ? "text" : "password"}
        id="password"
        placeholder={placeholder}
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
};

export { PasswordField };
