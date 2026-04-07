# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_ env vars must be present at build time (baked into the client bundle)
ARG VITE_TODOIST_API_TOKEN
ENV VITE_TODOIST_API_TOKEN=$VITE_TODOIST_API_TOKEN

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/client /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
