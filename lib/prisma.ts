import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Set DATABASE_URL if not present (for development)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
  console.log('Setting DATABASE_URL fallback for development:', process.env.DATABASE_URL)
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 