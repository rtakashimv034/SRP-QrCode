import { z } from "zod";
import { prisma } from "../lib/prisma";

import { Request, Response } from "express";
import { error } from "console";

const bcrypt = require('bcryptjs');


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
      res
      .status(409)
      .json({ errors: "user with same email already exists"})
      return;
    }
    const newUser = await prisma.users.create({data});
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
    
    

  } catch (error) {
    res.status(500).json({ errors: ` Server error: ${error} `})
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

async function login(req: Request, res: Response) {
  
  const data = userSchema.parse(req.body)

  const user = await prisma.users.findFirst({
    where: {
      email: data.email
    }
  })
  
  // Check if user exists

  if(!user) {
    res.status(404).json({errors : "Usuário não encontrado!"})
    return
  }

  // Check if password matches
  if(!(await bcrypt.compare(data.password, user.password))) {
    res.status(422).json({errors: "Senha inválida!"})
    return
  }

  // login ok
  res.status(201).json({
    name: user.name,
    email: user.email,
    supervisor: user.isSupervisor,
  })
}

export {createUser, getAllUsers, login};

