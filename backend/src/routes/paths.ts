import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

export const pathSchema = z.object({
  stationIdStr: z.string().startsWith("ET-"),
  prodSN: z.string().startsWith("PDT-"),
  registeredAt: z.string().transform((str) => new Date(str)),
});

type QueryParams = {
  prodSN: string;
  stationId: number;
  sectorName: string;
  month: number;
  year: number;
};

export async function getAllPaths(req: Request, res: Response) {
  const { prodSN, sectorName, stationId, month, year } =
    req.query as Partial<QueryParams>;

  let startDate, endDate;

  if (month && year) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 1);
  }

  try {
    const paths = await prisma.paths.findMany({
      orderBy: {
        registeredAt: "asc",
      },
      where: {
        prodSN,
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
    res.status(200).json(paths);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
