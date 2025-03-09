import { Edit2Icon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type LocalWorkstationProps = {
  name: string;
  localId: string;
};

export type CreationWorkstationProps = Pick<LocalWorkstationProps, "name">;

export type WorkstationProps = {
  id?: number;
  sectorName?: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
};

type Props = {
  station: LocalWorkstationProps;
  isLatest: boolean;
  onDelete: (id: string) => void;
  name: string; // Add name as a prop
  onNameChange: (id: string, name: string) => void; // Add onNameChange as a prop
};

export function WorkstationCard({
  isLatest,
  onDelete,
  station,
  name,
  onNameChange,
}: Props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEnabled(true);
  };

  useEffect(() => {
    if (isEnabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEnabled]);

  return (
    <div className="relative pb-2 flex w-full">
      <div className="flex w-full overflow-hidden flex-row rounded-md">
        <div className="bg-yellow-dark shrink-0 flex w-6" />
        <input
          ref={inputRef}
          type="text"
          placeholder={!isEnabled ? "Sector Name" : "Set sector name"}
          className={`outline-none w-full px-3 py-1 font-medium bg-gray-input placeholder:text-gray-placeholder placeholder:font-normal ${
            !isEnabled && "opacity-50"
          }`}
          required
          value={name}
          onChange={(e) => onNameChange(station.localId, e.target.value)} // Call onNameChange
          disabled={!isEnabled}
          onBlur={() => setIsEnabled(false)}
        />
        <div className="absolute right-2 top-1.5 items-center flex flex-row gap-1.5">
          <button
            className=" flex h-5 w-5 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-yellow-300"
            onClick={() => handleEdit()}
          >
            <Edit2Icon className="fill-black " />
          </button>
          <button
            className=" flex h-5 w-5 items-center justify-center opacity-60 border-black rounded-sm border p-[1px] hover:bg-red-300"
            onClick={() => onDelete(station.localId)}
          >
            <TrashIcon className="fill-black" />
          </button>
        </div>

        {!isLatest && (
          <div className="absolute opacity-50 left-1/2 -translate-x-1/2 -bottom-0 bg-gray-dark w-1 h-2" />
        )}
      </div>
    </div>
  );
}
