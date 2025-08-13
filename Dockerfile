# Use an official Bun runtime as a parent image
FROM oven/bun:1.2.20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and bun.lock to the working directory
# to leverage Docker cache for dependencies
COPY package.json bun.lock ./

# Install app dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["bun", "run", "start"]
