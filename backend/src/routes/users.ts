import { z } from "zod";
import { prisma } from "../lib/prisma";

import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { io, onlineUsers } from "../server";
import { sendEmail } from "../services/emailService";
interface QueryParams {
  order?: "asc" | "desc";
  isManager?: string;
}

const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  surname: z.string().optional(),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  isManager: z.string(),
  removeAvatar: z.string().optional(),
});

// Create a partial schema for updates
const updateUserSchema = userSchema.partial();

export async function createUser(req: Request, res: Response) {
  const { email, isManager, name, password, surname } = userSchema.parse(
    req.body
  );
  const avatar = req.file ? req.file.filename : null;

  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(409).json({ errors: "user with same email already exists" });
      return;
    }
    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      name,
      surname,
      email,
      password: hashedPassword,
      avatar,
      isManager: isManager === "true",
    };

    const newUser = await prisma.users.create({ data });

    // Envia um e-mail com a senha para o usuário
    await sendEmail({
      to: email,
      destName: `${newUser.name} ${newUser.surname}`,
      subject: "Bem-vindo ao Sistema!",
      text: `Olá ${name}, sua conta foi criada com sucesso. Sua senha é: ${password}`,
      html: `<p>Olá <strong>${name}</strong>,</p>
             <p>Sua conta foi criada com sucesso. Sua senha é: <strong>${password}</strong></p>
             <p>Recomendamos que você altere sua senha após o primeiro login.</p>`,
    });

    io.emit("create-user", data);

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
    io.emit("online-users", Array.from(onlineUsers.keys()));
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

    // Verificar se o usuário tem uma foto de perfil
    if (user.avatar) {
      const avatarPath = path.join(__dirname, "../uploads", user.avatar);

      // Verificar se o arquivo existe e deletá-lo
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath); // Deleta o arquivo
        console.log(`[+] Avatar ${user.avatar} deleted successfully.`);
      } else {
        console.log(`[-] Avatar ${user.avatar} not found in uploads folder.`);
      }
    }

    await prisma.users.delete({ where: { id } });

    io.emit("delete-user", user);

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
  const id = req.params.id;
  const { email, isManager, name, surname, password, removeAvatar } =
    updateUserSchema.parse(req.body);
  const avatar = req.file ? req.file.filename : null;

  try {
    const user = await prisma.users.findFirst({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ errors: "User not found" });
      return;
    }

    // Only check email if it's being updated
    if (email && email !== user.email) {
      const existingUser = await prisma.users.findFirst({
        where: { email },
      });
      if (existingUser) {
        res.status(409).json({ errors: "user with same email already exists" });
        return;
      }
    }

    // Verifica se a foto deve ser removida
    if (removeAvatar === "true" && user.avatar) {
      const avatarPath = path.join(__dirname, "../uploads", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath); // Deleta a foto do sistema de arquivos
      }
    }
    // Hash password only if it's being updated
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    const data = {
      name,
      surname,
      email,
      password: hashedPassword,
      avatar: removeAvatar === "true" ? null : avatar || user.avatar,
      isManager: isManager === "true",
    };

    const updatedUser = await prisma.users.update({
      where: { id },
      data,
    });

    io.emit("update-user", { ...updatedUser, id: updatedUser.id });

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
