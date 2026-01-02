FROM node:24-alpine AS build
RUN npm i -g @nestjs/cli
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
CMD [ "npm", "run", "start" ]
EXPOSE 3000
