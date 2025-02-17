# Specify the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies, including dev dependencies for nodemon
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000 to access the app
EXPOSE 3000

# Run in development mode using nodemon
CMD ["npx", "nodemon", "server.js"]

# For production, you can uncomment this line to use "npm start" instead of "npm run dev"
# CMD ["npm", "start"]
