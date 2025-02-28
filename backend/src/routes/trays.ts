import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const traySchema = z.object({
  qrcode: z.string(),
});

async function createTray(req: Request, res: Response) {
  const data = traySchema.parse(req.body);
  try {
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

async function deleteTray(req: Request, res: Response) {
  const id = req.params.id

  try {
    await prisma.users.delete({ where: { id }})
    res.status(204).send();
  } catch (error) {
    res.status(500).json( {mesasage: `Server error: ${error}` } );
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

export { createTray, getAllTrays, deleteTray };
