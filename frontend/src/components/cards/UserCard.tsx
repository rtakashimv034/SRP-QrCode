import defaultAvatar from "@/assets/default_avatar.png";
import { useAuth } from "@/hooks/useAuth";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { UserProps } from "../UserModal";
import { Card, CardContent } from "../ui/card";

type LocalUserProps = Pick<
  UserProps,
  "avatar" | "name" | "id" | "isManager" | "surname"
>;

type Props = {
  user: LocalUserProps;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export function UserCard({ user, onDelete, onUpdate }: Props) {
  const { isManager } = useAuth();
  return (
    <Card className="relative overflow-hidden rounded-xl bg-[#f6f6f6] h-28 shadow-md w-full flex">
      <div className="bg-green-light shrink-0 w-4" />
      <CardContent className="flex flex-row w-full p-2">
        <div className="w-full gap-3 flex flex-row items-center p-2">
          <img
            src={user.avatar ? user.avatar : defaultAvatar}
            alt="avatar"
            style={{
              minWidth: "90px",
              minHeight: "auto",
              width: "90px",
              height: "90px",
              borderRadius: "100%",
              maxWidth: "none",
              border: "1px solid",
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-normal text-lg overflow-hidden text-ellipsis">
                {user.name}
              </span>
              <span className="font-bold text-lg">{user.surname}</span>
            </div>
            <p className="text-xs opacity-70">
              Matrícula: #{user.id?.slice(0, 4)}
            </p>
            <p className="text-xs opacity-45 mt-1">
              Permissão: {user.isManager ? "Gerente" : "Supervisor"}
            </p>
          </div>
        </div>
      </CardContent>
      {isManager && (
        <div className="flex flex-col absolute top-1.5 right-1.5 gap-1.5">
          <button
            onClick={onUpdate}
            className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-yellow-300"
          >
            <Edit2Icon className="fill-black" />
          </button>
          <button
            className="flex h-4 w-4 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-red-300"
            onClick={onDelete}
          >
            <TrashIcon className="fill-black" />
          </button>
        </div>
      )}
    </Card>
  );
}
