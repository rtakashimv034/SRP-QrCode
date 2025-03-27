import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { io } from "../server";

const workstationSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(2),
});

const sectorSchema = z.object({
  name: z.string(),
  amountTrays: z.number().int().min(1).positive(),
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
        paths: true,
        defectivePaths: true,
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
        paths: true,
        defectivePaths: true,
      },
    });

    if (!sector) {
      res.status(404).json({ errors: "Sector not found" });
      return;
    }

    res.status(200).json(sector);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export async function createSector(req: Request, res: Response) {
  const { name, createdAt, workstations, amountTrays } = sectorSchema.parse(
    req.body
  );

  if (workstations.length < 3) {
    res.status(400).json({ errors: "At least 3 workstations are required" });
    return;
  }

  const data = {
    name,
    createdAt,
    amountTrays,
    workstations: {
      create: workstations,
    },
  };

  try {
    // create sector
    await prisma.sectors.create({
      data,
      include: { workstations: true, defectivePaths: true, paths: true },
    });

    io.emit("create-sector", data);
    res.status(201).json({ message: "Sector created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
  }
}

export async function updateSector(req: Request, res: Response) {
  const { name, workstations, amountTrays } = sectorSchema.parse(req.body);
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

    // Get current workstations to compare
    const currentSector = await prisma.sectors.findUnique({
      where: { name: sectorName },
      include: { workstations: true },
    });

    if (!currentSector) {
      res.status(404).json({ errors: "Sector not found" });
      return;
    }

    const operations = [];

    // 1. Identify workstations to delete (those that exist in DB but not in the update)
    const workstationsToDelete = currentSector.workstations.filter(
      (currentWs) => !workstations.some((ws) => ws.id === currentWs.id)
    );

    if (workstationsToDelete.length > 0) {
      operations.push(
        prisma.workstations.deleteMany({
          where: {
            id: { in: workstationsToDelete.map((ws) => ws.id) },
          },
        })
      );
    }

    // 2. Process each workstation from the request
    for (const ws of workstations) {
      // Workstation with ID - update
      if (ws.id) {
        operations.push(
          prisma.workstations.update({
            where: { id: ws.id },
            data: { name: ws.name },
          })
        );
      }
      // Workstation without ID - create new
      else {
        operations.push(
          prisma.workstations.create({
            data: {
              name: ws.name,
              sectorName: name,
            },
          })
        );
      }
    }

    // 3. Update the sector itself
    operations.push(
      prisma.sectors.update({
        where: { name: sectorName },
        data: {
          name,
          amountTrays,
        },
      })
    );

    // Execute all operations in a transaction
    await prisma.$transaction(operations);

    io.emit("update-sector", { name, amountTrays, workstations });
    res.status(200).json({ message: "Sector updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ errors: `Server error: ${error}` });
    console.error(error);
  }
}

export async function deleteSector(req: Request, res: Response) {
  const sectorName = req.params.name;
  try {
    // Busca os dados do setor antes de deletá-lo
    const sector = await prisma.sectors.findUnique({
      where: { name: sectorName },
      include: {
        workstations: true, // Inclui as workstations do setor
      },
    });

    if (!sector) {
      res.status(404).json({ errors: "Sector not found" });
      return;
    }

    await prisma.workstations.deleteMany({
      where: {
        sector: {
          name: sectorName,
        },
      },
    });
    await prisma.sectors.delete({ where: { name: sectorName } });
    io.emit("delete-sector", sector);
    res.status(204).json({ message: "Sector deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}
