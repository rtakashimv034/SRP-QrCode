import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const defectiveProductSchema = z.object({
  id: z.number().int(),
});

async function createDefectiveProduct(req: Request, res: Response) {
  const data = defectiveProductSchema.parse(req.body);

  try {
    await prisma.defectiveProducts.create({ data });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

async function getAllDefectiveProducts(req: Request, res: Response) {
  try {
    const defectiveProducts = await prisma.defectiveProducts.findMany({
      orderBy: {
        id: "desc",
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

export { createDefectiveProduct, getAllDefectiveProducts };
