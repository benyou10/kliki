import 'dotenv/config'
// CHANGE THIS LINE to point to your custom output directory:
import { PrismaClient } from '../generated/prisma' 
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

let prismaInstance: PrismaClient

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  prismaInstance = new PrismaClient({ adapter })
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  prismaInstance = globalForPrisma.prisma
}

export const prisma = prismaInstance