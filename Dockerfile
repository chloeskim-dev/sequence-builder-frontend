FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN sleep 3600
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build /app/build
CMD ["serve", "-s", "build", "-l", "3000"]
