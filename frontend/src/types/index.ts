export type UserProps = {
  id?: string;
  name: string;
  surname?: string;
  email: string;
  password?: string;
  isManager: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PathsProps = {
  id: number;
  stationId: number;
  prodSN: string;
  sectorName: string;
  registeredAt: string;
  product?: ProductProps;
};

export type DefectivePathsProps = {
  id: number;
  stationId?: number;
  defProdId: number;
  sectorName?: string;
  registeredAt: string;
  defectiveProduct?: DefectiveProductProps;
};

export type ProductProps = {
  SN: string;
  createdAt: string;
  paths: PathsProps[];
};

export type DefectiveProductProps = {
  id: number;
  createdAt: string;
  defectivePaths: DefectivePathsProps[];
};

export type SectorProps = {
  name: string;
  workstations: WorkstationProps[];
  id?: number; // Opcional, pois pode não existir no frontend
  amountTrays?: number;
  paths?: PathsProps[];
  defectivePaths?: DefectivePathsProps[];
};

export type WorkstationProps = {
  id?: number;
  name: string;
  sectorName?: string;
  localId?: string;
  paths?: PathsProps;
  defectivePaths?: PathsProps[];
};
