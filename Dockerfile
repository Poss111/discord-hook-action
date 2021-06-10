FROM node:14.16.1-alpine
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
