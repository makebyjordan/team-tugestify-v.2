import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { name: 'jordan' }
  });

  if (existingUser) {
    console.log('Usuario "jordan" ya existe.');
    return;
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      name: 'jordan',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
      password: 'Hola1234!'
    }
  });

  console.log('Usuario creado:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
