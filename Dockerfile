FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
# --- Add ARG and ENV before build ---
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Test that the variable is set
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL"
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build /app/build
CMD ["serve", "-s", "build", "-l", "3000"]
