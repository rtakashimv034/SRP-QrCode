import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function createTray(req: Request, res: Response) {
  try {
    await prisma.trays.create({});
    res.status(201).json({ message: "Tray created successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
export async function getAllTrays(req: Request, res: Response) {
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

export async function deleteTray(req: Request, res: Response) {
  const id = Number(req.body);
  try {
    await prisma.trays.delete({
      where: {
        id,
      },
    });
    res.status(201).json({ message: `Tray BDJ-${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
