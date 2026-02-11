import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/hash";

async function main() {
  console.log("[seed] Seeding default users...");

  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { username: "user" },
    update: {},
    create: {
      username: "user",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });

  console.log("[seed] Default users created: admin (ADMIN), user (USER)");
}

main()
  .catch((e) => {
    console.error("[seed] Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
