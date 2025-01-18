import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const traySchema = z.object({
  qrcode: z.string(),
});

async function createTray(req: Request, res: Response) {
  const data = traySchema.parse(req.body);
  try {
    const existingTray = await prisma.trays.findFirst({
      where: {
        qrcode: data.qrcode,
      },
    });
    if (existingTray) {
      res
        .status(409)
        .json({ message: "Tray with the same QR code already exists" });
      return;
    }
    await prisma.trays.create({
      data: {
        qrcode: data.qrcode,
      },
    });
    res.status(201).json({ message: "Tray created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
async function getAllTrays(req: Request, res: Response) {
  try {
    const trays = await prisma.trays.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(trays);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export { createTray, getAllTrays };
