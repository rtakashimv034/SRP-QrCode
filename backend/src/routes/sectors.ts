import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const workstationSchema = z.object({
  type: z.enum(["normal", "final", "defective"]),
  description: z.string(),
});

const sectorSchema = z.object({
  name: z.string(),
  createdAt: z.string().optional(),
  workstations: z.array(workstationSchema),
});

function validateSector(
  workstations: z.infer<typeof workstationSchema>[] = []
): string {
  if (workstations.length < 3) {
    return "Not enough workstations allowed";
  }

  const finalCount = workstations.filter(({ type }) => type === "final").length;
  const defectiveCount = workstations.filter(
    ({ type }) => type === "defective"
  ).length;

  if (finalCount !== 1 || defectiveCount !== 1) {
    return "Sector must contain one final and one defective workstation!";
  }
  return "";
}

export async function getAllsectors(req: Request, res: Response) {
  try {
    const sectors = await prisma.sectors.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        workstations: true,
      },
    });
    res.status(200).json(sectors);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export async function createSector(req: Request, res: Response) {
  const { name, createdAt, workstations } = sectorSchema.parse(req.body);
  const invalidation = validateSector(workstations);

  if (invalidation) {
    res.status(400).json({ error: invalidation });
    return;
  }

  try {
    // create workstations data
    const WSdata = workstations.map((ws, i) => ({
      type: ws.type,
      description: ws.description,
    }));
    // create sector
    await prisma.sectors.create({
      data: {
        name,
        createdAt,
        workstations: {
          create: WSdata,
        },
      },
    });
    res.status(201).json({ message: "Sector created successfully" });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
  }
}

export async function updateSector(req: Request, res: Response) {
  const { name, workstations } = sectorSchema.parse(req.body);
  const sectorName = req.params.name;

  if (!sectorName) {
    res.status(400).json({ errors: "Sector name is required in params" });
    return;
  }

  const invalidation = validateSector(workstations);
  if (invalidation) {
    res.status(400).json({ error: invalidation });
    return;
  }

  try {
    // Check if new name already exists (if name is being changed)
    if (name !== sectorName) {
      const existingSector = await prisma.sectors.findUnique({
        where: { name },
      });
      if (existingSector) {
        res.status(400).json({ error: "Sector name already exists" });
        return;
      }
    }

    // Delete all existing workstations and create new ones
    await prisma.sectors.update({
      where: { name: sectorName },
      data: {
        name,
        workstations: {
          deleteMany: {}, // Delete all workstations in this sector
          create: workstations.map((ws) => ({
            type: ws.type,
            description: ws.description,
          })),
        },
      },
    });

    res.status(200).json({ message: "Sector updated successfully" });
  } catch (error) {
    res.status(500).json({ errors: `Server error: ${error}` });
    console.error(error);
  }
}

export async function deleteSector(req: Request, res: Response) {
  const sectorName = req.params.name;
  try {
    await prisma.workstations.deleteMany({ where: { sectorName } });
    await prisma.sectors.delete({ where: { name: sectorName } });
    res.status(201).json({ message: "Sector deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}
