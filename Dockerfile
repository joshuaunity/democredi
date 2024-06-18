# Use an official Node.js runtime as a parent image
FROM node:20.14.0-slim

# Set the working directory in the container
WORKDIR /src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD [ "npm", "serve" ]
