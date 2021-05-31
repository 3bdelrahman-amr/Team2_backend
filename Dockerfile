# Specify a base image
FROM node:12.13.0-alpine AS alpine

WORKDIR /app

# Install dependencies and copy the contents of the project to the image
COPY package.json .
RUN npm install 
COPY . .

EXPOSE 4000

VOLUME [ "/src/photos" ]

RUN npm run seeds
# Default command for start-prod build
CMD ["npm", "run", "start-prod"]