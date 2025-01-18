import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const workStationSchema = z.object({
  sector: z.string(),
  isDisposal: z.boolean(),
  description: z.string().optional(),
  qrcode: z.string(),
});
export async function createWorkStation(req: Request, res: Response) {
  const data = workStationSchema.parse(req.body);

  try {
    // checks if workStation has the same qrcode
    const existingWorkStation = await prisma.workStations.findFirst({
      where: { qrcode: data.qrcode },
    });
    if (existingWorkStation) {
      res.status(409).json({ message: "Workstation already exists" });
      return;
    }
    await prisma.workStations.create({ data });
    res.status(201).json({ message: "Workstation created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
