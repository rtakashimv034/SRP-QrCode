import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const pathSchema = z.object({
  stationIdStr: z.string().startsWith("ET-"),
  prodSN: z.string().startsWith("PDT-"),
  registeredAt: z.string().transform((str) => new Date(str)),
});

export async function createPath(req: Request, res: Response) {
  try {
    const { prodSN, registeredAt, stationIdStr } = pathSchema.parse(req.body);
    const stationId = Number(stationIdStr.replace("ET-", ""));
    // checks if the station id exists on this specific sector
    const station = await prisma.workstations.findFirst({
      where: {
        id: stationId,
      },
    });
    if (!station) {
      res.status(404).json({ errors: "station does not exists no database" });
      return;
    }
    // create product if it does not exists
    const product = await prisma.products.upsert({
      where: { SN: prodSN },
      update: {},
      create: { SN: prodSN },
    });
    // create path
    await prisma.paths.create({
      data: {
        prodSN: product.SN,
        stationId,
        registeredAt,
      },
    });
    res.status(201).json({ message: "Paths registered successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
