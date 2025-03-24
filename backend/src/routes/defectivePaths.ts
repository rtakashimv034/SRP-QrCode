import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

export const defectivePathSchema = z.object({
  stationIdStr: z.string(),
  defProdIdStr: z.string().startsWith("DPROD-"),
  registeredAt: z.string().transform((str) => new Date(str).toISOString()),
});

export async function getAllDefectivePaths(req: Request, res: Response) {
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
  }
}
