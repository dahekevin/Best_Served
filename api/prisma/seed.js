import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@sistema.com' }, // se já existir, não cria novamente
    update: {}, // não faz updates
    create: {
      email: 'admin@sistema.com',
      password: hashedPassword,
      type: 'admin',
      phone: '',
      name: 'Administrador do Sistema',
    },
  });

  console.log('Administrador criado ou já existente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
