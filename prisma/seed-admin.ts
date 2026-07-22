import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Identifiants par défaut — À CHANGER (variables d'env recommandées en prod).
const EMAIL = process.env.ADMIN_EMAIL ?? "admin@umy.dev";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "umy-admin-2026";
const NAME = process.env.ADMIN_NAME ?? "Administrateur UMY";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.adminUser.upsert({
    where: { email: EMAIL.toLowerCase() },
    update: { passwordHash, name: NAME },
    create: { email: EMAIL.toLowerCase(), passwordHash, name: NAME, role: "admin" },
  });
  console.log(`✅ Admin prêt : ${user.email}`);
  console.log(`   Mot de passe : ${PASSWORD}  (à changer)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
