import { Card, CardContent } from "@/components/ui/card";
import { Edit2Icon, EyeIcon, TrashIcon } from "lucide-react";

type Props = {
  avatar: string;
  name: string;
  surName: string;
};

export default function UserPage({ avatar, name, surName }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-[716px] overflow-y-auto">
      <div className="grid grid-cols-3 gap-[38px]">
        {[...Array(18)].map((_, index) => (
          <Card key={index} className="overflow-hidden rounded-2xl shadow-md flex items-center w-full relative">
            <div className="bg-green-light w-6 h-full absolute left-0 top-0 bottom-0"></div>
            <div className="flex items-center pl-6 w-full">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={avatar} 
                  alt="avatar" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <CardContent className="flex flex-col ml-4 flex-grow">
                <h3 className="font-bold text-xl">Barcelos</h3>
                <p className="text-sm text-gray-600">Matrícula: 2233</p>
                <p className="text-sm text-gray-600">Permissão: Supervisor</p>
              </CardContent>
              <div className="flex flex-col gap-[6px] ml-auto pr-4">
                <button>
                  <Edit2Icon className="h-[20px] w-[20px] text-gray-400 border-2 border-gray-400 rounded-sm hover:bg-yellow-300 p-[2px]" />
                </button>
                <button>
                  <EyeIcon className="h-[20px] w-[20px] text-gray-400 border-2 border-gray-400 rounded-sm hover:bg-blue-300 p-[2px]" />
                </button>
                <button>
                  <TrashIcon className="h-[20px] w-[20px] text-gray-400 border-2 border-gray-400 rounded-sm hover:bg-red-300 p-[2px]" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
