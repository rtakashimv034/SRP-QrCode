import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export async function getAllDefectiveProducts(req: Request, res: Response) {
  try {
    const defectiveProducts = await prisma.defectiveProducts.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        defectivePaths: true,
      },
    });
    res.status(200).json(defectiveProducts);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    res.status(500).json(error);
    return;
  }
}
