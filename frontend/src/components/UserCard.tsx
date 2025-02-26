import { EllipsisVertical } from "lucide-react";

type Props = {
  avatarURL: string;
  name: string;
  surName: string;
};

export function UserCard({ avatarURL, name, surName }: Props) {
  return (
    <div className="bg-gradient-to-r from-green-default to-green-dark p-2 flex flex-row justify-between">
      <div className="flex flex-row space-x-4 items-center px-2">
        <img
          src={avatarURL}
          alt="PO"
          style={{
            minWidth: "70px",
            minHeight: "auto",
            width: "70px",
            height: "70px",
            borderRadius: "100%",
            maxWidth: "none",
          }}
        />
        <div className=" flex flex-col space-y-1 items-start child:text-white">
          <p className="font-light text-sm  leading-none">Bem vindo,</p>
          <p className="font-bold  text-sm leading-none">
            {name} {surName}
          </p>
        </div>
      </div>
      <EllipsisVertical color="white" size={26} />
    </div>
  );
}
