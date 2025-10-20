FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
