import { DefectiveProductProps } from "./defectiveProducts";

export type DefectivePathsProps = {
  id: number;
  stationId?: number;
  defProdId: number;
  sectorName?: string;
  registeredAt: string;
  defectiveProduct?: DefectiveProductProps;
};
