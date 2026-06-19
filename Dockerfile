# ========== STAGE 1: Build Frontend ==========
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ========== STAGE 2: Build Backend ==========
FROM node:20-alpine

WORKDIR /app
COPY server/package*.json ./server/
RUN npm install --prefix server
COPY server/ ./server/
COPY --from=frontend-builder /app/frontend/dist ./server/public

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server/index.js"]