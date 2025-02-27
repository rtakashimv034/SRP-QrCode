import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const pathSchema = z.object({
  stationId: z.number().int(),
  prodSN: z.string().regex(/^[A-Z0-9-]+$/, "Invalid serial number format"),
});

async function getAllPaths(req: Request, res: Response) {
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

export { getAllPaths };
