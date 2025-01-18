import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getAllDefectivePaths(req: Request, res: Response) {
  try {
    const defectivePaths = await prisma.defectivePaths.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json(defectivePaths);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
