// types.ts
export type Workstation = {
  id?: number; // Opcional, pois pode não existir no frontend
  name: string;
  sectorName?: string; // Opcional, pois pode não existir no frontend
};

export type Sector = {
  id?: number; // Opcional, pois pode não existir no frontend
  name: string;
  amountTrays: number;
  workstations: Workstation[];
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
