import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { defectivePathSchema } from "./defectivePaths";
import { pathSchema } from "./paths";

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

    // if same product passes to same path
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
        sectorName: station.sectorName,
      },
    });
    res.status(201).json({ message: "Paths registered successfully" });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export async function createDefectivePath(req: Request, res: Response) {
  try {
    const { defProdIdStr, registeredAt, stationIdStr } =
      defectivePathSchema.parse(req.body);
    const defProdId = Number(defProdIdStr.replace("DPROD-", ""));
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
    // if same product passes to same path
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
    // create defective product if it does not exists
    const defectiveProduct = await prisma.defectiveProducts.upsert({
      where: { id: defProdId },
      update: {},
      create: { id: defProdId },
    });
    // create path
    await prisma.defectivePaths.create({
      data: {
        defProdId: defectiveProduct.id,
        stationId,
        registeredAt,
        sectorName: station.sectorName,
      },
    });
    res
      .status(201)
      .json({ message: "Defective Paths registered successfully" });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
