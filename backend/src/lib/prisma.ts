import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: ["query"],
});

async function createAdmin() {
  try {
    const adminUser = await prisma.users.findUnique({
      where: { email: "admin@gmail.com" },
    });

    // If admin user doesn't exist, create one
    if (!adminUser) {
      await prisma.users.create({
        data: {
          email: "admin@gmail.com",
          name: "admin",
          isManager: true,
          password: await bcrypt.hash("admin123", 10),
        },
      });
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}
createAdmin();

export { prisma };
