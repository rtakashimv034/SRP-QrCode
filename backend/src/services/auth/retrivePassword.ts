import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../emailService";

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({
        message: "User does not exists",
      });
      return;
    } else if (user.email === "admin@gmail.com") {
      res.status(403).json({
        message: "Cannot reset password for admin user",
      });
      return;
    }

    const payload = {
      userId: user.id,
      purpose: "password_reset",
      email: user.email,
    };

    // 2. Gere um token único com expiração (ex: 1 hora)
    const resetToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "5m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      destName: user.name,
      subject: "Recuperação de Senha",
      text: "Você solicitou a recuperação de senha.",
      html: `
      <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
      <a target="_blank" href="${resetLink}">Redefinir Senha</a>
      <p>Este link expira em 5 minutos.</p>
    `,
    });

    res.status(201).json({
      message: "Link de recuperação enviado ao email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar solicitação" });
    return;
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body;

  try {
    // 1. Verificar e decodificar o JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      purpose: string;
      email: string;
      iat: number;
      exp: number;
    };

    if (decoded.purpose !== "password_reset") {
      res.status(400).json({
        message: "Token inválido para esta operação",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.status(201).json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ error: "Token expirado" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ error: "Token inválido" });
      return;
    }
    console.error("Erro no resetPassword:", error);
    res.status(500).json({ error: "Erro ao redefinir senha" });
    return;
  }
}

export async function verifyResetToken(req: Request, res: Response) {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      purpose: string;
    };

    if (decoded.purpose !== "password_reset") {
      res
        .status(400)
        .json({ isValid: false, reason: "Token inválido para esta operação" });
      return;
    }

    res.status(201).json({ isValid: true });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ isValid: false, reason: "Token expirado" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ isValid: false, reason: "Token inválido" });
      return;
    }
    res.status(500).json({ error: "Erro ao verificar token" });
    return;
  }
}
