import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
  //... other configuration
});

export { prisma };
