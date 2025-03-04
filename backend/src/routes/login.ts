import { Request, Response } from "express";
import { authenticateUser, loginSchema } from "../services/authService";
export async function login(req: Request, res: Response) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: "Email and password are required." });
  }
  const { email, password } = loginSchema.parse(req.body);
  try {
    const { token } = await authenticateUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error });
    console.error(error);
    return;
  }
}
