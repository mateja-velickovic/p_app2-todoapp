# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# # Prod stage
# FROM nginx:stable-alpine

# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]