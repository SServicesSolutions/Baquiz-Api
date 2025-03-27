# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3001/api/health || exit 1
CMD ["npm", "start"]
