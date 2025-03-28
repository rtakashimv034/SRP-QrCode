import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { io } from "../server";
import { defectivePathSchema } from "./defectivePaths";
import { pathSchema } from "./paths";

export async function createPath(req: Request, res: Response) {
  try {
    const { prodSN, registeredAt, stationIdStr } = pathSchema.parse(req.body);
    const stationId = Number(stationIdStr.replace("ET-", ""));

    const station = await prisma.workstations.findFirst({
      where: {
        id: stationId,
      },
    });
    if (!station) {
      res.status(404).json({ errors: "station does not exists no database" });
      return;
    }

    const path = await prisma.paths.findFirst({
      where: {
        stationId,
        prodSN,
      },
    });
    if (path) {
      res
        .status(400)
        .json({ errors: "same product already passed to this path" });
      return;
    }

    await prisma.products.upsert({
      where: { SN: prodSN },
      update: { createdAt: registeredAt },
      create: { SN: prodSN, createdAt: registeredAt },
    });

    const newPath = await prisma.paths.create({
      data: {
        prodSN,
        stationId,
        registeredAt,
        sectorName: station.sectorName,
      },
      include: {
        product: {
          include: {
            paths: true,
          },
        },
        Sectors: {
          where: {
            name: station.sectorName,
          },
          include: {
            paths: true,
            defectivePaths: true,
            workstations: {
              include: {
                paths: true,
                defectivePaths: true,
              },
            },
          },
        },
      },
    });

    // Emite o evento para atualizar o setor
    io.emit("update-sector", newPath.Sectors);
    io.emit("create-path", newPath);
    res.status(201).json({ message: "Paths registered successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export async function createDefectivePath(req: Request, res: Response) {
  try {
    const { defProdIdStr, registeredAt, stationIdStr } =
      defectivePathSchema.parse(req.body);
    const defProdId = Number(defProdIdStr.replace("DPROD-", ""));
    const stationId = Number(stationIdStr.replace("ET-", ""));

    const station = await prisma.workstations.findFirst({
      where: {
        id: stationId,
      },
    });
    if (!station) {
      res.status(404).json({ errors: "station does not exists no database" });
      return;
    }

    const defectivePath = await prisma.defectivePaths.findFirst({
      where: {
        defProdId,
        stationId,
      },
    });
    if (defectivePath) {
      res
        .status(400)
        .json({ errors: "same product already passed to this path" });
      return;
    }

    // crio ou atualizo produto defeituoso
    await prisma.defectiveProducts.upsert({
      where: { id: defProdId },
      update: { createdAt: registeredAt },
      create: { id: defProdId, createdAt: registeredAt },
    });

    // Cria o caminho defeituoso
    const newDefectivePath = await prisma.defectivePaths.create({
      data: {
        defProdId,
        stationId,
        registeredAt,
        sectorName: station.sectorName,
      },
      include: {
        defectiveProduct: {
          include: {
            defectivePaths: true,
          },
        },
        Sectors: {
          where: {
            name: station.sectorName,
          },
          include: {
            defectivePaths: true,
            paths: true,
            workstations: {
              include: {
                defectivePaths: true,
                paths: true,
              },
            },
          },
        },
      },
    });

    // Emite o evento para atualizar o setor
    io.emit("update-sector", newDefectivePath.Sectors);
    io.emit("create-defective-path", newDefectivePath);
    res
      .status(201)
      .json({ message: "Defective Paths registered successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
