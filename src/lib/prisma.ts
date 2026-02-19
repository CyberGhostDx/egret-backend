import { PrismaClient } from "../../prisma/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
})

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
