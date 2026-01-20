import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password_hash: password,
      role: 'ADMIN',
      is_active: true,
    },
  });

  const tech1 = await prisma.user.upsert({
    where: { email: 'tech1@example.com' },
    update: {},
    create: {
      email: 'tech1@example.com',
      name: 'Budi Teknisi',
      password_hash: password,
      role: 'TECHNICIAN',
      is_active: true,
    },
  });

  const tech2 = await prisma.user.upsert({
    where: { email: 'tech2@example.com' },
    update: {},
    create: {
      email: 'tech2@example.com',
      name: 'Sandi Teknisi',
      password_hash: password,
      role: 'TECHNICIAN',
      is_active: true,
    },
  });

  console.log({ admin, tech1, tech2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
