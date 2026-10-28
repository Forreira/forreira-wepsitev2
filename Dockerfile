FROM node:20-alpine AS build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/backend ./backend
COPY frontend ./frontend
WORKDIR /app/backend
EXPOSE 3000
CMD ["sh", "-c", "node dist/database/seed.js && node dist/main"]
