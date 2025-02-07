import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateSerialNumber } from "../utils/SNgenerator";

const stepSchema = z.object({
  stationQrcode: z.string(),
  trayQrcode: z.string(),
  registeredAt: z.string().transform((str) => new Date(str)),
});

type Station = {
  stationId: number;
  registeredAt: Date;
};

let stations: Station[] = [];

export async function generateStep(req: Request, res: Response) {
  const step = stepSchema.parse(req.body);

  try {
    // fetch last normal workstation and the current workstaton
    const [lastWorkstation, currentWorkstation] = await prisma.$transaction([
      prisma.workstations.findFirst({
        where: {
          isDisposal: false,
        },
        orderBy: {
          id: "desc",
        },
      }),
      prisma.workstations.findUnique({
        where: { qrcode: step.stationQrcode },
      }),
    ]);
    if (!currentWorkstation) {
      res.status(404).json({ message: "Current workstation not found" });
      return;
    }
    stations.push({
      stationId: currentWorkstation.id,
      registeredAt: step.registeredAt,
    });
    // itera sobre a lista de stations e da um post pra cada step (criando novas paths)
    if (lastWorkstation?.id === currentWorkstation?.id && stations.length > 0) {
      const product = await prisma.products.create({
        data: {
          SN: generateSerialNumber(),
        },
      });
      // array of path data
      const data = stations.map(({ stationId, registeredAt }) => ({
        prodSN: product.SN,
        stationId,
        createdAt: registeredAt,
      }));
      // Create all paths in a single call
      await prisma.paths.createMany({ data });
      stations = [];
      res.status(200).json({ message: "Paths registered successfully" });
      return;
    }
    // verifica se é uma estação de dispatch
    if (currentWorkstation.isDisposal) {
      const defectiveProduct = await prisma.defectiveProducts.create({});
      const data = stations.map(({ registeredAt, stationId }) => ({
        defProdId: defectiveProduct.id,
        stationId,
        createdAt: registeredAt,
      }));
      // Create all defective paths in a single call
      await prisma.defectivePaths.createMany({ data });
      stations = [];
      res
        .status(200)
        .json({ message: "Defective paths registered successfully" });
      return;
    }

    res.status(200).json({ message: "step registered" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
