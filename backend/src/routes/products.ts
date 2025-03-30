import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { io } from "../server";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        paths: true,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export async function deleteAllProducts(req: Request, res: Response) {
  try {
    await prisma.paths.deleteMany();
    await prisma.products.deleteMany();
    res.status(204).json({ message: "Cleared all products!" });
    io.emit("delete-products");
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
