import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { workStationSchema } from "./workstations";
const sectorSchema = z.object({
  name: z.string(),
  createdAt: z.string().optional(),
  workstations: z.array(workStationSchema),
});

function validateWS(
  workstations: z.infer<typeof workStationSchema>[] = []
): string {
  if (workstations.length < 3) {
    return "Not enough workstations allowed";
  }

  const finalCount = workstations.filter(({ type }) => type === "final").length;
  const defectiveCount = workstations.filter(
    ({ type }) => type === "defective"
  ).length;

  if (finalCount !== 1 || defectiveCount !== 1) {
    return "Sector must contain one final and one defective workstation!";
  }

  const qrCodes = new Set(workstations.map(({ qrcode }) => qrcode));
  if (qrCodes.size !== workstations.length) {
    return "Duplicate QR codes are not allowed within the same sector.";
  }
  return "";
}

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
  const invalidation = validateWS(workstations);

  if (invalidation) {
    res.status(400).json({ error: invalidation });
    return;
  }
  // query all existing qrcodes
  const existingQrcodes = await prisma.workstations
    .findMany({
      select: { qrcode: true },
    })
    .then((ws) => ws.map((ws) => ws.qrcode));
  // checks if some QRcode is already being used in other sector
  const qrCodes = workstations.map((ws) => ws.qrcode);
  const conflictingQRCodes = qrCodes.filter((qr) =>
    existingQrcodes.includes(qr)
  );

  if (conflictingQRCodes.length > 0) {
    res.status(400).json({
      error: `QR codes ${conflictingQRCodes.join(
        ", "
      )} are already in use in other sectors.`,
    });
    return;
  }

  try {
    await prisma.sectors.create({
      data: {
        name,
        createdAt,
        workstations: {
          create: workstations,
        },
      },
    });
    res.status(201).json({ message: "Sector created successfully" });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
  }
}

async function updateSector(req: Request, res: Response) {
  const { name, workstations } = sectorSchema.parse(req.body);
  const sectorName = req.params.name;

  if (!sectorName) {
    res.status(400).json({ errors: "Sector name is required in params" });
    return;
  }

  const isInvalid = validateWS(workstations);
  if (isInvalid) {
    res.status(400).json({ error: isInvalid });
    return;
  }

  // checks for existing qrcodes in other sectors
  const existingQRCodesInOtherSectors = await prisma.workstations
    .findMany({
      where: { sectorName: { not: sectorName } },
      select: { qrcode: true },
    })
    .then((ws) => ws.map((ws) => ws.qrcode));

  // query all qrcodes
  const existingQrcodes = await prisma.workstations
    .findMany({
      where: { sectorName },
    })
    .then((ws) => ws.map((ws) => ws.qrcode));
  // checks if some QRcode is already being used in other sector
  const qrCodes = workstations.map((ws) => ws.qrcode);
  const conflictingQRCodes = qrCodes.filter((qr) =>
    existingQRCodesInOtherSectors.includes(qr)
  );

  if (conflictingQRCodes.length > 0) {
    res.status(400).json({
      error: `QR codes ${conflictingQRCodes.join(
        ", "
      )} are already in use in other sectors.`,
    });
    return;
  }
  // create update and create sectors lists
  const updates = workstations
    .filter(({ qrcode }) => existingQrcodes.includes(qrcode))
    .map(({ qrcode, ...rest }) => ({
      where: { qrcode },
      data: { ...rest },
    }));

  const creates = workstations.filter(
    (ws) => !existingQrcodes.some((qr) => qr === ws.qrcode)
  );

  try {
    await prisma.sectors.update({
      where: { name: sectorName },
      data: {
        name,
        workstations: {
          deleteMany: { qrcode: { notIn: [...qrCodes] } },
          update: updates,
          create: creates,
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
