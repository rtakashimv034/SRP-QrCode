import { ProductProps } from "./products";

export type PathsProps = {
  id: number;
  stationId: number;
  prodSN: string;
  sectorName: string;
  registeredAt: string;
  product?: ProductProps;
};
