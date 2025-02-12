import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateSerialNumber } from "../utils/SNgenerator";

const stepSchema = z.object({
  sectorName: z.string(),
  stationId: z.number(),
  trayQrcode: z.string(),
  registeredAt: z.string().transform((str) => new Date(str)),
});

let steps: z.infer<typeof stepSchema>[] = [];

export async function generateStep(req: Request, res: Response) {
  const step = stepSchema.parse(req.body);

  try {
    // checks if the station id exists on this specific sector
    const station = await prisma.workstations.findFirst({
      where: {
        id: step.stationId,
        sectorName: step.sectorName,
      },
    });
    if (!station) {
      res
        .status(404)
        .json({ errors: "station or sector not found or is already disposed" });
      return;
    }
    // add to steps list
    steps.push(step);
    // verifica se é ultima estação
    if (station.type === "final") {
      // create product
      const product = await prisma.products.create({
        data: {
          SN: generateSerialNumber(),
        },
      });
      // array of path data
      const data = steps.map(({ stationId, registeredAt }) => ({
        prodSN: product.SN,
        stationId,
        sectorName: step.sectorName,
        registeredAt,
      }));
      // Create all paths in a single call
      await prisma.paths.createMany({ data });
      steps = [];
      res.status(201).json({ message: "Paths registered successfully" });
      return;
    }
    // verifica se é estação de defeito
    if (station.type === "defective") {
      // create defective product
      const defectiveProduct = await prisma.defectiveProducts.create({});
      // array of path data
      const data = steps.map(({ stationId, registeredAt }) => ({
        defProdId: defectiveProduct.id,
        stationId,
        sectorName: step.sectorName,
        registeredAt,
      }));
      // Create all paths in a single call
      await prisma.defectivePaths.createMany({ data });
      steps = [];
      res
        .status(201)
        .json({ message: "Defective paths registered successfully" });
      return;
    }
    res.status(201).json({ message: "Step added successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
