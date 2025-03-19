import { PathsProps } from "./paths";

export type Workstation = {
  id?: number;
  name: string;
  sectorName?: string;
  localId?: string;
  paths?: PathsProps;
  defectivePaths?: PathsProps[];
};
