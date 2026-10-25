FROM node:22

RUN apt-get update && \
    apt-get install -y swi-prolog

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend

RUN npm install 

WORKDIR /app

COPY . .

RUN find /app -name "server.js"

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "server.js"]
