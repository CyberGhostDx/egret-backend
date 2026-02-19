import { createHash, randomBytes } from "crypto"

export const generateRandomToken = (size = 32): string => {
  return randomBytes(size).toString("base64url")
}

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex")
}
