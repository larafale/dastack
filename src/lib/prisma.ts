import { PrismaClient } from '@/generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export type Model = keyof typeof prisma;

export const getModel = (model: Model) => {
  return prisma[model];
};

export const getModels = () => ['user'];

export default prisma;
