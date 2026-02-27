import { betterAuth, APIError } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { customSession } from "better-auth/plugins"
import prisma from "./prisma"
import { env } from "../../config/env"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  trustedOrigins: [env.FRONTEND_URL],
  advanced: {
    cookiePrefix: "egret",
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  hooks: {
    before: async (ctx) => {
      if (ctx.request) {
        const url = new URL(ctx.request.url)
        if (url.pathname.endsWith("/sign-up/email")) {
          throw new APIError("BAD_REQUEST", {
            message: "Registration via email is disabled.",
          })
        }
      }
      return { context: ctx }
    },
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
          role: (user as any).role,
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
        },
      }
    }),
  ],
})
