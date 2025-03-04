import defaultAvatar from "@/assets/default_avatar.png";
import { Menu } from "../Menu";
import { UserCard } from "../UserCard";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="w-screen h-screen overflow-hidden grid grid-cols-[20%_80%] space-x-8 bg-default p-20 child:rounded-lg">
      <aside className="grid grid-rows-[20%_80%] space-y-8 child:rounded-lg">
        <UserCard avatar={defaultAvatar} name="Pedro" surName="Yutaro" />
        <Menu />
      </aside>
      <main className="rounded-lg bg-white">{children}</main>
    </div>
  );
}
