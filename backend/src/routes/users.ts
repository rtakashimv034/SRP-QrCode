import { z } from "zod";
import { prisma } from "../lib/prisma";

import { Request, Response } from "express";

import bcrypt from "bcryptjs";

interface QueryParams {
  order?: "asc" | "desc";
  isSupervisor?: string;
}

const userSchema = z.object({
  name: z.string(),
  surname: z.string(),
  password: z.string().min(8, "password must be at least 8 characters"),
  avatar: z.string().optional(),
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
      res.status(409).json({ errors: "user with same email already exists" });
      return;
    }
    // create new user
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = await prisma.users.create({ data });

    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}

async function deleteUser(req: Request, res: Response) {
  const email = req.params.email

  try {
    await prisma.users.delete({ where: { email }})
    res.status(204).send();
  } catch (error) {
    res.status(500).json( {mesasage: `Server error: ${error}` } );
    console.error(error);
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


export {createUser, getAllUsers, deleteUser};
