# Use a fixed version of Bun
FROM oven/bun:1.3

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

# Start the application with automatic migration
CMD sh -c "bunx prisma migrate deploy && exec bun run start"
