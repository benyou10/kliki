import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';

const globalForPrisma = globalThis as unknown as { __prismaClient?: PrismaClient };
export const prisma = globalForPrisma.__prismaClient ?? new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prismaClient = prisma;
}

export default prisma;
