import { prisma } from "../lib/prisma";

import { Request, Response } from "express";

interface QueryParams {
  order?: "asc" | "desc";
  isSupervisor?: string;
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const { isSupervisor, order }: QueryParams = req.query;
    const condition =
      isSupervisor === "true"
        ? true
        : isSupervisor === "false"
        ? false
        : undefined;
    const users = await prisma.users.findMany({
      orderBy: {
        name: order || "asc",
      },
      where: {
        isSupervisor: condition,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
