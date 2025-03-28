import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as z from "zod";
import { prisma } from "../../lib/prisma";

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET não está definido!");
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function authenticateUser(email: string, password: string) {
  try {
    loginSchema.parse({ email, password });
  } catch (err) {
    throw new Error(`Invalid Data: ${err}`);
  }
  // checks if user exists
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  // checks if password matches
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid Password");
  }

  const payload = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    avatar: user.avatar,
    email: user.email,
    isManager: user.isManager,
  };

  // generate and return JWT
  const token = jwt.sign(payload, secretKey!, {
    expiresIn: "7d",
  });

  return { token };
}
