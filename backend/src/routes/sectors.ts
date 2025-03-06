import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const workstationSchema = z.object({
  description: z.string(),
});

const sectorSchema = z.object({
  name: z.string(),
  createdAt: z.string().optional(),
  workstations: z.array(workstationSchema),
});

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

export async function getSectorByName(req: Request, res: Response) {
  const name = req.params.name as string;

  try {
    const sector = await prisma.sectors.findFirst({
      where: {
        name,
      },
      include: {
        workstations: true,
      },
    });

    if (!sector) {
      res.status(404).json({ errors: "Sector not found" });
      return;
    }

    res.status(200).json(sector);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export async function createSector(req: Request, res: Response) {
  const { name, createdAt, workstations } = sectorSchema.parse(req.body);

  if (workstations.length < 3) {
    res.status(400).json({ errors: "At least 3 workstations are required" });
    return;
  }

  try {
    // create sector
    await prisma.sectors.create({
      data: {
        name,
        createdAt,
        workstations: {
          create: workstations,
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

  if (workstations.length < 3) {
    res.status(400).json({ errors: "At least 3 workstations are required" });
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
          create: workstations,
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
    res.status(204).json({ message: "Sector deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}
