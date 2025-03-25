import { PathsProps } from "./paths";
import { Workstation } from "./workstation";

export type Sector = {
  name: string;
  workstations: Workstation[];
  id?: number; // Opcional, pois pode não existir no frontend
  amountTrays?: number;
  paths?: PathsProps[];
  defectivePaths?: PathsProps[];
};
