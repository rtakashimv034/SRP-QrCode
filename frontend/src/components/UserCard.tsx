import { Edit2Icon, TrashIcon } from "lucide-react";
import { UserProps } from "./UserModal";
import { Card, CardContent } from "./ui/card";

type LocalUserProps = Pick<
  UserProps,
  "avatar" | "name" | "id" | "isManager" | "surname"
>;

type Props = {
  data: LocalUserProps;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export function UserCard({ data, onDelete, onUpdate }: Props) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md flex items-center w-full relative">
      <div className="bg-green-light w-6 h-full absolute left-0 top-0 bottom-0" />
      <div className="flex items-center pl-6 w-full">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={data.avatar}
            alt="avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <CardContent className="flex flex-col ml-4 flex-grow">
          <div className="flex flex-row items-center gap-1">
            <h2 className="font-bold text-xl">{data.name}</h2>
            <h3 className="font-normal text-xl">{data.surname}</h3>
          </div>
          <p className="text-sm text-gray-600">
            Matrícula: #{data.id?.slice(0, 4)}
          </p>
          <p className="text-sm text-gray-600">
            Permissão: {data.isManager ? "Gerente" : "Supervisor"}
          </p>
        </CardContent>
        <div className="flex flex-col gap-[6px] ml-auto pr-4">
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
      </div>
    </Card>
  );
}
