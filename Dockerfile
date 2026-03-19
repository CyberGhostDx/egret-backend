# Use a fixed version of Bun
FROM oven/bun:1.3

# Install curl for health checking (using --no-install-recommends to keep the image slim)
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files and lockfile
COPY package.json bun.lock ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN MYSQL_DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy" bun run generate

# Expose the server port (default 8000)
EXPOSE 8000

# Health check configuration (using a 30s start-period to allow migrations to complete)
HEALTHCHECK --interval=20s --timeout=5s --retries=5 --start-period=30s \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start the application with automatic migration
CMD sh -c "bunx prisma migrate deploy && exec bun run start"
