FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g next

ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000

CMD ["npm", "run", "dev"] 