import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // use the same library your signup uses (bcrypt or bcryptjs)

const prisma = new PrismaClient();

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    throw new Error('Usage: npx ts-node prisma/create-admin.ts <email> <password>');
  }

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {}, // never overwrites an existing admin's password
    create: {
      email,
      password: await bcrypt.hash(password, 10),
      firstName: 'Admin',
      middleName: '-',
      lastName: 'Sollnis',
    },
  });

  console.log('Admin ready:', admin.id, admin.email);
}

main().finally(() => prisma.$disconnect());