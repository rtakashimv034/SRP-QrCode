import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const defectivePathSchema = z.object({
  stationIdStr: z.string(),
  defProdIdStr: z.string().startsWith("DPROD-"),
  registeredAt: z.string().transform((str) => new Date(str)),
});

export async function getAllDefectivePaths(req: Request, res: Response) {
  try {
    const paths = await prisma.paths.findMany({
      orderBy: {
        registeredAt: "asc",
      },
    });
    res.status(200).json(paths);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export async function createDefectivePath(req: Request, res: Response) {
  try {
    const { defProdIdStr, registeredAt, stationIdStr } =
      defectivePathSchema.parse(req.body);
    const stationId = Number(stationIdStr.replace("ET-", ""));
    // checks if the station id exists on this specific sector
    const station = await prisma.workstations.findFirst({
      where: {
        id: stationId,
      },
    });
    if (!station) {
      res.status(404).json({ errors: "station does not exists no database" });
      return;
    }
    // create defective product if it does not exists
    const defProdId = Number(defProdIdStr.replace("DPROD-", ""));
    const defectiveProduct = await prisma.defectiveProducts.upsert({
      where: { id: defProdId },
      update: {},
      create: { id: defProdId },
    });
    // create path
    await prisma.defectivePaths.create({
      data: {
        defProdId: defectiveProduct.id,
        stationId,
        registeredAt,
      },
    });
    res
      .status(201)
      .json({ message: "Defective Paths registered successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
