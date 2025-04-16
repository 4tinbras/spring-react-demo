FROM node:18-alpine

WORKDIR /app

#First install dependencies
COPY package*.json ./
RUN npm install
#Then copy other contents
COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]