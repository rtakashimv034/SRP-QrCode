import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { workStationSchema } from "./workstations";

const sectorSchema = z.object({
  name: z.string(),
  createdAt: z.string().optional(),
  workstations: z.array(workStationSchema).optional(),
});

async function getAllsectors(req: Request, res: Response) {
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

async function createSector(req: Request, res: Response) {
  const { name, createdAt, workstations } = sectorSchema.parse(req.body);
  try {
    await prisma.sectors.create({
      data: {
        name,
        createdAt,
        workstations: {
          create: workstations?.map(({ isDisposal, description, qrcode }) => ({
            isDisposal,
            qrcode,
            description,
          })),
        },
      },
    });
    res.status(201).json({ message: "Sector created successfully" });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}

async function updateSector(req: Request, res: Response) {
  const { name, workstations } = sectorSchema.parse(req.body);
  const sectorName = req.params.name;

  if (!sectorName) {
    res.status(400).json({ errors: "Sector name is required in params" });
    return;
  }

  try {
    await prisma.sectors.update({
      where: { name: sectorName },
      data: {
        name, // Atualiza o nome do setor
        workstations: {
          // Remove workstations que não estão mais na lista
          deleteMany: {
            qrcode: { notIn: workstations?.map((ws) => ws.qrcode) }, // Remove as estações ausentes
          },
          // Atualiza workstations existentes
          update: workstations
            ?.filter((ws) => ws.qrcode) // Apenas estações já existentes
            .map(({ qrcode, isDisposal, description }) => ({
              where: { qrcode },
              data: { isDisposal, description },
            })),
          // Cria novas workstations que não existem ainda
          create: workstations
            ?.filter((ws) => !ws.qrcode) // Apenas estações novas
            .map(({ isDisposal, qrcode, description }) => ({
              isDisposal,
              qrcode,
              description,
              sector: { connect: { name } },
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

async function deleteSector(req: Request, res: Response) {
  const name = req.params.name;
  try {
    await prisma.workstations.deleteMany({ where: { sectorName: name } });
    await prisma.sectors.delete({ where: { name } });
    res.status(201).json({ message: "Sector deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}

export { createSector, deleteSector, getAllsectors, updateSector };
