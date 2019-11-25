FROM node:10

WORKDIR /usr/src/app
COPY package.json .
run npm install
COPY . .

CMD ["npm", "start"]