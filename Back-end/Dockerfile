FROM node:current-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . .

CMD ["npm", "start"]
