FROM node:16

#create app directory
WORKDIR /docker

#install app dependecies
COPY package*.json ./
RUN npm install

#bundle app source
COPY . .

CMD ["npm", "start"]
