FROM node:10
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm install
COPY . /app/

EXPOSE 8080
CMD ["npm", "start"]
