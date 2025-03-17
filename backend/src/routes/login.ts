import { Request, Response } from "express";
import { authenticateUser, loginSchema } from "../services/authService";
export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
  }
  try {
    const { token } = await authenticateUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error });
    console.error(error);
    return;
  }
}
