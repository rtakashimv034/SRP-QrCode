import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

const workStationSchema = z.object({
  sector: z.string(),
  isDisposal: z.boolean(),
  description: z.string().optional(),
  qrcode: z.string(),
});

async function createWorkStation(req: Request, res: Response) {
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
async function getAllWorkstations(req: Request, res: Response) {
  try {
    const workstations = await prisma.workStations.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(workstations);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

async function deleteWorkstation(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    await prisma.workStations.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

async function updateWorkstation(req: Request, res: Response) {
  const data = workStationSchema.parse(req.body);
  const id = Number(req.params.id);

  try {
    // checks if workStation has the same qrcode
    const existingWorkStation = await prisma.workStations.findMany({
      where: { qrcode: data.qrcode },
    });
    if (existingWorkStation.length > 1) {
      res.status(409).json({ message: "Workstation qrocde already exists" });
      return;
    }
    // update workstation
    await prisma.workStations.update({
      where: { id },
      data,
    });
    res.status(204).json({ message: "workstation updated successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export {
  createWorkStation,
  deleteWorkstation,
  getAllWorkstations,
  updateWorkstation,
};
