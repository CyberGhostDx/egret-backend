import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { customSession } from "better-auth/plugins"
import prisma from "./prisma"
import { env } from "@/config/env"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  trustedOrigins: [env.FRONTEND_URL],
  advanced: {
    cookiePrefix: "egret",
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
        },
      }
    }),
  ],
})
