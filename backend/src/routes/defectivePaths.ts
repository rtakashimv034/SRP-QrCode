import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const defectivePathSchema = z.object({
  stationId: z.number().int(),
  defProdId: z.number().int(),
  sectorName: z.string(),
});

async function createDefectivePath(req: Request, res: Response) {
  const data = defectivePathSchema.parse(req.body);

  try {
    // Check if the path already exists
    const existingPath = await prisma.defectivePaths.findUnique({
      where: {
        stationId_defProdId_sectorName: {
          stationId: data.stationId,
          defProdId: data.defProdId,
          sectorName: data.sectorName,
        },
      },
    });
    if (existingPath) {
      res.status(409).json({ message: "Path already exists" });
      return;
    }
    // register new path
    await prisma.defectivePaths.create({ data });
    res.status(201).json({ message: "Path registered successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
async function getAllDefectivePaths(req: Request, res: Response) {
  try {
    const defectivePaths = await prisma.defectivePaths.findMany({
      orderBy: {
        registeredAt: "asc",
      },
    });
    res.status(200).json(defectivePaths);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export { createDefectivePath, getAllDefectivePaths };
