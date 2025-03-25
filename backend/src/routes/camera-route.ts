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

    const product = await prisma.products.upsert({
      where: { SN: prodSN },
      update: { createdAt: registeredAt },
      create: { SN: prodSN, createdAt: registeredAt },
    });

    const data = {
      prodSN: product.SN,
      stationId,
      registeredAt,
      sectorName: station.sectorName,
    };

    // Cria o caminho
    await prisma.paths.create({
      data,
    });

    // Busca os dados atualizados do setor
    const sector = await prisma.sectors.findUnique({
      where: { name: station.sectorName },
      include: {
        paths: true,
        defectivePaths: true,
      },
    });

    // Emite o evento para atualizar o setor
    if (sector) {
      io.emit("update-sector", sector);
    }

    io.emit("create-product", product);
    io.emit("create-path", data);
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

    const defectiveProduct = await prisma.defectiveProducts.upsert({
      where: { id: defProdId },
      update: { createdAt: registeredAt },
      create: { id: defProdId, createdAt: registeredAt },
    });

    const data = {
      defProdId: defectiveProduct.id,
      stationId,
      registeredAt,
      sectorName: station.sectorName,
    };

    // Cria o caminho defeituoso
    await prisma.defectivePaths.create({ data });

    // Busca os dados atualizados do setor
    const sector = await prisma.sectors.findUnique({
      where: { name: station.sectorName },
      include: {
        paths: true,
        defectivePaths: true,
      },
    });

    // Emite o evento para atualizar o setor
    if (sector) {
      io.emit("update-sector", sector);
    }
    io.emit("create-defective-product", defectiveProduct);
    io.emit("create-defective-path", data);
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
