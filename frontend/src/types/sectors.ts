import { PathsProps } from "@/components/pages/Reports";

// types.ts
export type Workstation = {
  id?: number; // Opcional, pois pode não existir no frontend
  name: string;
  sectorName?: string; // Opcional, pois pode não existir no frontend
  paths?: PathsProps;
  defectivePaths?: PathsProps[];
};

export type Sector = {
  id?: number; // Opcional, pois pode não existir no frontend
  name: string;
  amountTrays: number;
  workstations: Workstation[];
  paths?: PathsProps;
  defectivePaths?: PathsProps[];
};

export type LocalWorkstation = {
  localId: string; // Identificador único temporário no frontend
  name: string;
};

export type CreationSector = {
  name: string;
  amountTrays: number;
  workstations: LocalWorkstation[];
};

export type UpdateSector = {
  name: string;
  workstations: Workstation[];
};
