import { Menu } from "../Menu";
import { UserCard } from "../UserCard";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="w-screen h-screen grid grid-cols-[20%_80%] space-x-8 bg-default p-20 child:rounded-lg">
      <aside className="grid grid-rows-[20%_80%] space-y-8 child:rounded-lg">
        <UserCard
          avatarURL="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jair_Bolsonaro_2019_Portrait_%283x4_cropped%29.jpg/1200px-Jair_Bolsonaro_2019_Portrait_%283x4_cropped%29.jpg"
          name="Benicio"
          surName="Mozan"
        />
        <Menu />
      </aside>
      <main className="rounded-lg bg-white">{children}</main>
    </div>
  );
}
