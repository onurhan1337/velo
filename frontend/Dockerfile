FROM node:20-alpine3.19 AS base

WORKDIR /app

COPY package.json package-lock.json ./

FROM base AS deps
RUN npm ci

FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine3.19 AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
CMD ["node", "server.js"] 