# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies with legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run Prisma Migrate to apply database migrations
RUN npx prisma migrate deploy

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
