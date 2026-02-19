import { type CookieOptions } from "express"
import { env } from "./env"

const isProduction = env.NODE_ENV === "production"

export const cookieConfig = {
  accessToken: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 mins
  } as CookieOptions,

  refreshToken: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/auth/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  } as CookieOptions,

  csrfToken: {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  } as CookieOptions,

  clearOptions: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  } as CookieOptions,
}
