FROM node:14.14.0-alpine as build 
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build

FROM nginx 
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html


#COPY --from=0 /app/build /usr/share/nginx/html

# docker build -t client -f ./client/Dockerfile ./client
# 