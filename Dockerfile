FROM oven/bun:alpine

WORKDIR /app

COPY . .

RUN bun install

RUN bun run build

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["bun","/app/build/index.js"]