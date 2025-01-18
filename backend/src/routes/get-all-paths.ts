import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getAllPaths(req: Request, res: Response) {
  try {
    const paths = await prisma.paths.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json(paths);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
