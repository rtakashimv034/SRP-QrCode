import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

export const defectivePathSchema = z.object({
  stationIdStr: z.string(),
  defProdIdStr: z.string().startsWith("DPROD-"),
  registeredAt: z.string().transform((str) => new Date(str)),
});

type QueryParams = {
  defProdId: number;
  stationId: number;
  sectorName: string;
  month: number;
  year: number;
};

export async function getAllDefectivePaths(req: Request, res: Response) {
  const { defProdId, sectorName, stationId, month, year } =
    req.query as Partial<QueryParams>;

  let startDate, endDate;

  if (month && year) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 1);
  }

  try {
    const defectivePaths = await prisma.defectivePaths.findMany({
      orderBy: {
        registeredAt: "asc",
      },
      where: {
        defProdId,
        Sectors: {
          name: sectorName,
        },
        stationId,
        registeredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    res.status(200).json(defectivePaths);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
