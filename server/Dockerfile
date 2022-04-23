FROM node:14.14.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]

# docker build -t server .
#  docker run -it -p 4002:3001