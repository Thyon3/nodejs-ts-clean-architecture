# ---------- Base ----------
FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run compile

# Create logs directory
RUN mkdir -p logs

# Make health check script executable
COPY scripts/health-check.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/health-check.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD health-check.sh

# Run the application
CMD ["npm", "start"]

# ---------- Release ----------
FROM base AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Command
CMD [ "node", "./dist/app.js" ]
