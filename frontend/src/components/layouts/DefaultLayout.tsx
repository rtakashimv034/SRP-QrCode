import { baseURL } from "@/api";
import defaultAvatar from "@/assets/images/default_avatar.png";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { SplashScreen } from "../screens/SplashScreen";
import { Menu } from "./Menu";
import { UserAsideCard } from "./UserAsideCard";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (!user) {
    return <SplashScreen />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden grid grid-cols-[20%_80%] space-x-8 bg-default p-20 child:rounded-lg">
      <aside className="grid grid-rows-[20%_80%] space-y-8 child:rounded-lg">
        <UserAsideCard
          avatar={
            user.avatar ? `${baseURL}/uploads/${user.avatar}` : defaultAvatar
          }
          name={user.name}
          surName={user.surname}
        />
        <Menu />
      </aside>
      <main className="rounded-lg bg-white py-6 px-5 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
