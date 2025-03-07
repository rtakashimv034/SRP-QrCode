import { z } from "zod";
import { prisma } from "../lib/prisma";

import { Request, Response } from "express";

import bcrypt from "bcryptjs";

interface QueryParams {
  order?: "asc" | "desc";
  isManager?: string;
}

const userSchema = z.object({
  name: z.string().min(3, ""),
  surname: z.string(),
  password: z.string().min(8, "password must be at least 8 characters"),
  avatar: z.string().optional(),
  email: z.string().email(),
  isManager: z.boolean(),
});

// Create a partial schema for updates
const updateUserSchema = userSchema.partial();

export async function createUser(req: Request, res: Response) {
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
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ errors: ` Server error: ${error} ` });
    console.log(error);
    return;
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const { isManager, order }: QueryParams = req.query;
    const condition =
      isManager === "true" ? true : isManager === "false" ? false : undefined;
    const users = await prisma.users.findMany({
      orderBy: {
        name: order || "asc",
      },
      where: {
        isManager: condition,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export async function getUserById(req: Request, res: Response) {
  const id = req.params.id as string;

  try {
    const user = await prisma.users.findFirst({ where: { id } });
    if (!user) {
      res.status(404).json({ errors: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const user = await prisma.users.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      res.status(404).json({ errors: "User not found" });
      return;
    }
    await prisma.users.delete({ where: { id } });
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const updateData = updateUserSchema.parse(req.body);

    const user = await prisma.users.findFirst({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ errors: "User not found" });
      return;
    }

    // Only check email if it's being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await prisma.users.findFirst({
        where: { email: updateData.email },
      });
      if (existingUser) {
        res.status(409).json({ errors: "user with same email already exists" });
        return;
      }
    }

    // Hash password only if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await prisma.users.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ message: `Server error: ${error}` });
    console.error(error);
    return;
  }
}
