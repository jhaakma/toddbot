FROM node:10

WORKDIR /usr/src/app
COPY package.json .
run npm install
COPY . .

EXPOSE 8080
CMD ["npm", "start"]
