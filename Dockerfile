# Stage 1: Build & Install dependencies
FROM oven/bun:1.3-slim AS builder

WORKDIR /app

# Install openssl for Prisma generation
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files and install all dependencies (including devDependencies)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN MYSQL_DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy" bun run generate

# Prune devDependencies to keep the production node_modules minimal
RUN rm -rf node_modules && bun install --frozen-lockfile --production


# Stage 2: Production Release
FROM oven/bun:1.3-slim

WORKDIR /app

# Install production-only system dependencies
RUN apt-get update && apt-get install -y curl openssl && rm -rf /var/lib/apt/lists/*

# Set production environment
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

# Expose the server port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=20s --timeout=5s --retries=5 --start-period=30s \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start the application
CMD sh -c "bunx --bun prisma migrate deploy && exec bun run start"
