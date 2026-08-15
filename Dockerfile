FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
ENV NODE_ENV=production
ENV DATA_PATH=/app/data/entries.json
RUN mkdir -p /app/data
EXPOSE 3000
CMD ["npm", "start"]
