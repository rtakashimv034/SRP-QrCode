import { z } from "zod";
import { prisma } from "../lib/prisma";

import { Request, Response } from "express";

interface QueryParams {
  order?: "asc" | "desc";
  isSupervisor?: string;
}

const userSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
  isSupervisor: z.boolean(),
});

async function createUser(req: Request, res: Response) {
  const data = userSchema.parse(req.body);
  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      res.status(409).json({ message: "user with same email already exists" });
      return;
    }
    await prisma.users.create({ data });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}

async function getAllUsers(req: Request, res: Response) {
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

export { createUser, getAllUsers };
