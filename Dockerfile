# Use the official Bun image
FROM oven/bun:1.1

# Set the working directory
WORKDIR /app

# Copy package files and lockfile
COPY package.json bun.lock ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN bun run generate

# Expose the server port (default 8000)
EXPOSE 8000

# Start the application
CMD ["bun", "run", "start"]
