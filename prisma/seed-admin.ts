import { auth } from "../src/shared/lib/auth"
import prisma from "../src/shared/lib/prisma"
import { env } from "../src/config/env"

async function seedAdmin() {
  console.log("Starting admin seeding...")

  const adminEmail = env.ADMIN_EMAIL
  const adminPassword = env.ADMIN_PASSWORD
  const adminName = "EGRET Admin"

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingUser) {
      console.log(`⚠User with email ${adminEmail} already exists.`)

      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "admin" },
      })
      console.log("Updated existing user role to 'admin'.")
      return
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    })

    if (!result || !result.user) {
      throw new Error("Failed to create user via Better Auth API")
    }

    console.log(`User created successfully with ID: ${result.user.id}`)

    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: "admin" },
    })

    console.log(" Admin seeding completed successfully!")
    console.log(`-----------------------------------`)
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log(`Role: admin`)
    console.log(`-----------------------------------`)
  } catch (error) {
    console.error("Seeding failed:", error)
  } finally {
    process.exit()
  }
}

seedAdmin()
