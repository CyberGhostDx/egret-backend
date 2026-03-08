<p align="center">
  <img src="https://lh3.googleusercontent.com/d/1vRrDe-028hDsVOTA6Ul6zMQhOaG5oXVB" alt="egret" width="200" height="200">
</p>

# EGRET Backend

This is the backend system for the EGRET project, built with **Bun**, **Express.js**, **Prisma (MySQL)**, and **MongoDB**, utilizing **Better Auth** for comprehensive authentication management.

## 🛠️ Tech Stack

- **Core:** Bun + Express
- **Database & ORM:** Prisma (MySQL), Mongoose (MongoDB)
- **Authentication:** Better Auth
- **Validation:** Zod
- **Logging:** Pino

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

## 📁 Folder Structure

```text
src/
├── app.ts              # Express application configuration
├── server.ts           # Server entry point
├── routes.ts           # Main router
├── config/             # Configuration files (env, cors)
├── modules/            # Modular architecture
│   ├── admin/          # Admin-related logic
│   ├── courses/        # Course and offering logic
│   ├── reviews/        # Review system (MongoDB)
│   └── users/          # User profile and enrollments
├── shared/             # Shared utilities and middlewares
│   ├── lib/            # Shared libraries (prisma, mongoose, logger)
│   ├── middleware/     # Shared express middlewares (auth, error-handler)
│   └── schemas/        # Shared Zod schemas
└── types.d.ts          # Global type definitions
```

```text
src/
├── app.ts              # Express application configuration
├── server.ts           # Server entry point
├── routes.ts           # Main router
├── config/             # Configuration files (env, cors)
├── modules/            # Modular architecture
│   ├── admin/          # Admin-related logic
│   ├── courses/        # Course and offering logic
│   ├── reviews/        # Review system (MongoDB)
│   └── users/          # User profile and enrollments
├── shared/             # Shared utilities and middlewares
│   ├── lib/            # Shared libraries (prisma, mongoose, logger)
│   ├── middleware/     # Shared express middlewares (auth, error-handler)
│   └── schemas/        # Shared Zod schemas
└── types.d.ts          # Global type definitions
```

## API Documentation

All API endpoints are prefixed with `/api`. Authentication is required for most endpoints (handled via cookies).

### Authentication

Authentication is managed by **Better Auth**.

| Method | Endpoint  | Description                                     |
| :----- | :-------- | :---------------------------------------------- |
| ANY    | `/auth/*` | Handles login, logout, session management, etc. |

### Users (`/api/users`)

| Method   | Endpoint              | Description                          | Notes / Body                 |
| :------- | :-------------------- | :----------------------------------- | :--------------------------- |
| `GET`    | `/me`                 | Get current user profile & dashboard | Includes enrolled courses    |
| `POST`   | `/enroll`             | Enroll in a course offering          | `{ "offeringId": "string" }` |
| `DELETE` | `/enroll/:offeringId` | Unenroll from a course offering      |                              |

### Courses (`/api/courses`)

| Method | Endpoint     | Description                 | Notes                                       |
| :----- | :----------- | :-------------------------- | :------------------------------------------ |
| `GET`  | `/offerings` | List all course offerings   | Includes instructors, exams, and difficulty |
| `GET`  | `/:id`       | Get specific course details | Search by course code                       |

### Reviews (`/api/reviews`)

| Method | Endpoint     | Description              | Notes / Body                                                         |
| :----- | :----------- | :----------------------- | :------------------------------------------------------------------- |
| `GET`  | `/:courseId` | Get reviews for a course |                                                                      |
| `POST` | `/:courseId` | Post a new review        | `{ "difficulty": 1-5, "content": "string", "isAnonymous": boolean }` |

### Admin (`/api/admin`)

_Requires Admin role_

| Method   | Endpoint                     | Description                                 |
| :------- | :--------------------------- | :------------------------------------------ |
| `GET`    | `/dashboard`                 | Admin dashboard statistics                  |
| `GET`    | `/courses/offerings`         | View all offerings with detailed exam info  |
| `GET`    | `/reviews`                   | Manage all reviews across all courses       |
| `DELETE` | `/reviews/:reviewId`         | Soft delete a review                        |
| `PATCH`  | `/reviews/:reviewId/restore` | Restore a deleted review                    |
| `POST`   | `/exam`                      | Bulk upload/create exams from CSV-like data |
| `PATCH`  | `/exams`                     | Update existing exam details                |
| `DELETE` | `/exams/:examId`             | Delete a specific exam                      |
| `DELETE` | `/offerings/:offeringId`     | Delete a course offering                    |

## 🔗 Frontend

[EGRET-Frontend](https://github.com/cyberghostdx/egret)

## Database Design

[PDF](https://github.com/CyberGhostDx/egret-backend/blob/develop/docs/EGRET%20Database%20Design.pdf)
