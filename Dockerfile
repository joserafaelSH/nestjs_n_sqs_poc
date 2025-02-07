#Configuracao base para o Dockerfile
FROM node:20 AS base
RUN npm i -g pnpm 

#Instalacao das dependencias
FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install 

#Build da aplicacao
FROM base AS build 
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

#Deploy da aplicacao
FROM node:20-alpine3.19 AS deploy
WORKDIR /usr/src/app
RUN npm i -g pnpm
RUN pnpm i prisma -D
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma
RUN pnpm prisma generate
EXPOSE 8000
EXPOSE 5555
CMD ["pnpm", "start:prod"]