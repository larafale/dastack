import users from './seed/users.json';

import prisma from '@/lib/prisma';

async function seedEntity(entityName: string, data: any) {
  console.log(`> seeding ${entityName}...`);
  for (const record of data) {
    await prisma[entityName].create({
      data: record,
    });
  }
}

async function seed() {
  await seedEntity('user', users);
}

console.log('seeding...');
seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    console.log('done.');
    await prisma.$disconnect();
  });
