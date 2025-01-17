import { prisma } from "../lib/prisma";

import { Request, Response } from "express";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}
