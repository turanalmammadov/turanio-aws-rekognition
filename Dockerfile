# Multi-stage Dockerfile for turanio-aws-rekognition
# =====================================================
# Stage 1: Build stage (install dependencies)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production

# =====================================================
# Stage 2: Runtime stage
FROM node:18-alpine AS runtime

# Security: Run as non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

# Copy application source
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

# Application uses HTTPS on port 5555 and HTTP on port 80
EXPOSE 80 5555

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:80', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" || exit 1

# Start the application
CMD ["node", "server.js"]
