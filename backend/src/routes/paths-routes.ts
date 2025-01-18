import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const pathSchema = z.object({
  stationId: z.number().int(),
  prodSN: z.string().regex(/^[A-Z0-9-]+$/, "Invalid serial number format"),
});

async function createPath(req: Request, res: Response) {
  const data = pathSchema.parse(req.body);

  try {
    // Check if the path already exists
    const existingPath = await prisma.paths.findUnique({
      where: {
        stationId_prodSN: {
          stationId: data.stationId,
          prodSN: data.prodSN,
        },
      },
    });
    if (existingPath) {
      res.status(409).json({ message: "Path already exists" });
      return;
    }
    // register new path
    await prisma.paths.create({ data });
    res.status(201).json({ message: "Path registered successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

async function getAllPaths(req: Request, res: Response) {
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

export { createPath, getAllPaths };
