import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

export const pathSchema = z.object({
  stationIdStr: z.string().startsWith("ET-"),
  prodSN: z.string().startsWith("PDT-"),
  registeredAt: z.string().transform((str) => new Date(str).toISOString()),
});

export async function getAllPaths(req: Request, res: Response) {
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
