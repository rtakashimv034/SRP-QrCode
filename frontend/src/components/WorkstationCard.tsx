import { Edit2Icon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type LocalWorkstationProps = {
  description: string;
  localId: string;
};

export type WorkstationProps = {
  id?: number;
  sectorName?: string;
  description: string;
  updatedAt: string;
  createdAt: string;
};

export type CreationWorkstationProps = Pick<
  LocalWorkstationProps,
  "description"
>;

type Props = {
  station: LocalWorkstationProps;
  isLatest: boolean;
  onDelete: (id: string) => void;
  description: string; // Add description as a prop
  onDescriptionChange: (id: string, description: string) => void; // Add onDescriptionChange as a prop
};

export function WorkstationCard({
  isLatest,
  onDelete,
  station,
  description,
  onDescriptionChange,
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
          placeholder={!isEnabled ? "Edit description" : "Description name..."}
          className={`outline-none w-full px-3 py-1 font-medium bg-gray-input placeholder:text-gray-placeholder placeholder:font-normal ${
            !isEnabled && "opacity-50"
          }`}
          value={description}
          onChange={(e) => onDescriptionChange(station.localId, e.target.value)} // Call onDescriptionChange
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
