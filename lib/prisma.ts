import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient()
}

export const prisma = globalForPrisma.prisma

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Diagnostic temporaires
if (process.env.NODE_ENV === 'development') {
  console.log('[Prisma Init] cwd=', process.cwd(), 'DB URL=', process.env.DATABASE_URL);
}
