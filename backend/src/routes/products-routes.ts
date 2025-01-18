import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const productSchema = z.object({
  SN: z.string().regex(/^[A-Z0-9-]+$/, "Invalid serial number format"),
});

async function createProduct(req: Request, res: Response) {
  const data = productSchema.parse(req.body);

  try {
    await prisma.products.create({ data });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export { createProduct, getAllProducts };
