<p align="center">
  <img src="https://lh3.googleusercontent.com/d/1vRrDe-028hDsVOTA6Ul6zMQhOaG5oXVB" alt="egret" width="200" height="200">
</p>

# EGRET Backend

This is the backend system for the EGRET project, built with **Bun**, **Express.js**, **Prisma (MySQL)**, and **MongoDB**, utilizing **Better Auth** for comprehensive authentication management.

## 📋 Prerequisites

- [Bun](https://bun.sh/) (Version >= 1.3.0)
- MySQL (Version >= 9.0)
- MongoDB (Version >= 8.0)

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   bun install
   ```

2. **Environment Variables Setup**
   Copy the `.env.example` file to create your `.env` file:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and fill in the values (Google Client ID and Secret are optional; you can skip them if you don't have them)

3. **Database Management (Prisma)**
   After configuring your database connections, generate the Prisma Client and migrate the database schema:

   ```bash
   bun run generate
   bun run migrate
   ```

4. **Seeding Database & Admin Setup (🔑 IMPORTANT)**
   If you **do not have** a `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` configured for Google OAuth, you will not be able to log in via the standard user interface.

   **Workaround:** You can log in to the admin dashboard via the `/admin/login` route on the frontend using the email and password defined in your `.env` file (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).

   To ensure the admin account exists in the database, you must run the database seed command first:

   ```bash
   bun run db:seed # seed data
   bun run prisma/seed-admin.ts # Seed admin account
   ```

5. **Start the Development Server**
   ```bash
   bun run dev
   ```
   The server will start on the port specified in your `.env` file.

## 🐳 Running with Docker

This repository includes a `docker-compose.yml` to spin up the entire backend stack including **MySQL** and **MongoDB**.

1. **Spin up the stack:**

   ```bash
   docker compose up -d
   ```

2. **Initialize Database (Prisma):**
   Even inside Docker, you need to run migrations for the first time:

   ```bash
   docker exec -it egret-backend bun run migrate
   docker exec -it egret-backend bun run db:seed
   docker exec -it egret-backend bun run prisma/seed-admin.ts
   ```

## 🛠️ Tech Stack

- **Core:** Bun + Express
- **Database & ORM:** Prisma (MySQL), Mongoose (MongoDB)
- **Authentication:** Better Auth
- **Validation:** Zod
- **Logging:** Pino

## 🔗 Frontend

[EGRET-Frontend](https://github.com/cyberghostdx/egret)
