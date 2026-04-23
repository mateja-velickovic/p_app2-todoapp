FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

# ENV NODE_ENV=production

# node app.js
CMD ["npm", "run", "start:ci"]