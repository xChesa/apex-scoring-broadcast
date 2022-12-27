# build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY ./frontend/package.json /app/
COPY ./frontend/yarn.lock /app/
RUN yarn install
COPY ./frontend .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]