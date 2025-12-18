// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Replace 'your_admin_password' with the desired password.
  // Remember: never commit plain text passwords. This is just for demonstration.
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
