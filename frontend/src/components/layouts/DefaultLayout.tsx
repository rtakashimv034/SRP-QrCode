import { baseURL } from "@/api";
import { socket } from "@/api/socket";
import defaultAvatar from "@/assets/images/default_avatar.png";
import { useAuth } from "@/hooks/useAuth";
import { useCache } from "@/hooks/useCache";
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
  const { user, signOut } = useAuth();
  const { clearCache } = useCache<UserProps[]>({
    key: "users-cache",
  });

  useEffect(() => {
    if (!user) {
      signOut();
      navigator("/login");
    }
    socket.on("update-user", (updatedUser: UserProps) => {
      if (updatedUser.id === user?.id) {
        user!.name = updatedUser.name;
        user!.surname = updatedUser.surname;
        user!.avatar = updatedUser.avatar;
        user!.email = updatedUser.email;
        user!.isManager = updatedUser.isManager;
        if (updatedUser.isManager === false) {
          clearCache();
        }
      }
    });

    socket.on("delete-user", (deletedUser: UserProps) => {
      if (deletedUser.id === user?.id) {
        signOut();
        navigator("/login");
      }
    });

    return () => {
      socket.off("update-user");
      socket.off("delete-user");
    };
  }, [clearCache, navigator, signOut, user]);

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  const myHeight = window.innerHeight;

  return (
    <div
      className={`w-screen h-screen overflow-hidden grid grid-cols-[20%_80%] space-x-8 bg-default ${
        myHeight >= 700 ? "p-20" : "p-12"
      } child:rounded-lg`}
    >
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
