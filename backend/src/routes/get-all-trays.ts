import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getAllTrays(req: Request, res: Response) {
  try {
    const trays = await prisma.trays.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(trays);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
