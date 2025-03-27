import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

function clearUploadsFolder() {
  const uploadDir = path.join(__dirname, "../src/uploads");

  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlinkSync(filePath);
      console.log(`[+] Deleted file: ${filePath}`);
    });
    console.log(`[+] Cleared uploads folder.`);
  } else {
    console.log(`[-] Uploads folder does not exist.`);
  }
}

async function main() {
  clearUploadsFolder();
  const defaultPassword = "admin123";
  try {
    const admin = await prisma.users.upsert({
      where: { email: "admin@gmail.com" },
      update: {
        avatar: null,
      },
      create: {
        name: "SRP",
        surname: "Admin",
        isManager: true,
        email: "admin@gmail.com",
        password: await bcrypt.hash(defaultPassword, 10),
      },
    });

    console.log(`
    [+] Admin user created:
      => Email: "${admin.email}"
      => Password: "${defaultPassword}"
    `);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
