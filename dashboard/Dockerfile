FROM node:12 AS build

WORKDIR /app

ADD package.json package-lock.json ./
RUN npm config set unsafe-perm true && \
    npm install

ADD . .
# ADD .git ./
RUN npm run build-js-prod
# RUN npm prune --production

# copy default config
RUN mkdir -p dist/config && cp config/config.prod.jsonc dist/config/config.json

### Stage 2: just use the built assets

FROM nginx:1.17-alpine AS main

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

ADD  ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
