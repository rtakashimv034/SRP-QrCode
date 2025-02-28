import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

export const workStationSchema = z.object({
  description: z.string(),
  type: z.enum(["normal", "final", "defective"]),
});

async function createWorkStation(req: Request, res: Response) {
  const data = workStationSchema.parse(req.body);

  try {
    await prisma.workstations.create({ data });
    res.status(201).json({ message: "Workstation created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
async function getAllWorkstations(req: Request, res: Response) {
  try {
    const workstations = await prisma.workstations.findMany({
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
    await prisma.workstations.delete({ where: { id } });
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
    await prisma.workstations.update({
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
