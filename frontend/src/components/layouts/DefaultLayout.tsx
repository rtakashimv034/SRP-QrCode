import defaultAvatar from "@/assets/default_avatar.png";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "../Menu";
import { UserCard } from "../UserCard";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const { user } = useAuth();

  const getAvatarSrc = () => {
    if (!user?.avatar || user.avatar === "") {
      return defaultAvatar;
    }
    return user.avatar;
  };

  return (
    <div className="w-screen h-screen overflow-hidden grid grid-cols-[20%_80%] space-x-8 bg-default p-20 child:rounded-lg">
      <aside className="grid grid-rows-[20%_80%] space-y-8 child:rounded-lg">
        <UserCard
          avatar={getAvatarSrc()}
          name={user!.name}
          surName={user!.surName}
        />
        <Menu />
      </aside>
      <main className="rounded-lg bg-white py-6 px-5 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
