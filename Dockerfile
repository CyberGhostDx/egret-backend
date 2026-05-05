# Stage 1: Build
FROM oven/bun:1.3-alpine AS builder

# Install openssl for Prisma generation
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install ALL dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN MYSQL_DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy" bunx --bun prisma generate

# Stage 2: Production
FROM oven/bun:1.3-alpine

# Install production-only system dependencies
RUN apk add --no-cache curl openssl

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

# Expose the server port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=20s --timeout=5s --retries=5 --start-period=30s \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start the application
CMD sh -c "bunx prisma migrate deploy && exec bun run start"
