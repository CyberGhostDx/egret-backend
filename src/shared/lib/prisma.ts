import { PrismaClient } from "../../../prisma/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../../config/env";

const adapter = new PrismaMariaDb({
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  connectionLimit: 5,
  allowPublicKeyRetrieval: env.NODE_ENV !== "production",
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
