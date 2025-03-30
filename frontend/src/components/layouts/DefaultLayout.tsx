import { baseURL } from "@/api";
import { socket } from "@/api/socket";
import defaultAvatar from "@/assets/images/default_avatar.png";
import { useAuth } from "@/hooks/useAuth";
import { UserProps } from "@/types";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Menu } from "./Menu";
import { UserAsideCard } from "./UserAsideCard";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const navigator = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigator("/login");
    }
    socket.on("update-user", (updatedUser: UserProps) => {
      if (updatedUser.id === user?.id) {
        user!.name = updatedUser.name;
        user!.surname = updatedUser.surname;
        user!.avatar = updatedUser.avatar;
        user!.email = updatedUser.email;
        user!.isManager = updatedUser.isManager;
      }
    });

    socket.on("delete-user", (deletedUser: UserProps) => {
      if (deletedUser.id === user?.id) {
        navigator("/login");
      }
    });

    return () => {
      socket.off("update-user");
      socket.off("delete-user");
    };
  }, [navigator, user]);

  if (!user) {
    return <Navigate to={"/login"} replace />;
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
