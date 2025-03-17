import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient({
  log: ["query"],
});

// Função para limpar a pasta /uploads
function clearUploadsFolder() {
  const uploadsPath = path.join(__dirname, "../uploads");

  if (fs.existsSync(uploadsPath)) {
    const files = fs.readdirSync(uploadsPath);
    files.forEach((file) => {
      const filePath = path.join(uploadsPath, file);
      fs.unlinkSync(filePath);
      console.log(`[+] Deleted file: ${filePath}`);
    });
    console.log(`[+] Cleared uploads folder.`);
  } else {
    console.log(`[-] Uploads folder does not exist.`);
  }
}

// Função para criar o admin
async function createAdmin() {
  try {
    const adminUser = await prisma.users.findUnique({
      where: { email: "admin@gmail.com" },
    });

    // Se o admin não existir, cria um
    if (!adminUser) {
      await prisma.users.create({
        data: {
          email: "admin@gmail.com",
          name: "admin",
          isManager: true,
          password: await bcrypt.hash("admin123", 10),
        },
      });

      // Verifica se o banco de dados está vazio (apenas o admin foi criado)
      const amount = await prisma.users.count();
      if (amount === 1) {
        // Limpa a pasta /uploads
        clearUploadsFolder();
      }
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Função para verificar se o banco de dados foi resetado
async function checkDatabaseReset() {
  try {
    const userCount = await prisma.users.count();

    // Se o banco de dados estiver vazio, limpa a pasta /uploads
    if (userCount === 0) {
      clearUploadsFolder();
    }
  } catch (error) {
    console.error("Error checking database reset:", error);
  }
}

// Verifica se o banco de dados foi resetado e limpa a pasta /uploads, se necessário
checkDatabaseReset();

// Chama a função para criar o admin
createAdmin();

export { prisma };
