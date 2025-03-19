import { PathsProps } from "./paths";
import { Workstation } from "./workstation";

export type Sector = {
  id?: number; // Opcional, pois pode não existir no frontend
  name: string;
  amountTrays: number;
  workstations: Workstation[];
  paths?: PathsProps[];
  defectivePaths?: PathsProps[];
};

export type CreationSector = {
  name: string;
  amountTrays: number;
  workstations: Workstation[];
};

export type UpdateSector = {
  name: string;
  workstations: Workstation[];
};
