import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// In production, ensure the database URL is set, otherwise throw a clear error
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  throw new Error('FATAL ERROR: DATABASE_URL environment variable is not set in production.')
}

const prisma = global.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') global.prisma = prisma