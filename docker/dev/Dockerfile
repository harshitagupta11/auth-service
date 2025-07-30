# use the official Node.js image as the base image

FROM node:22.10.0


# set the working directory in the container
WORKDIR /usr/src/app

# copy package.json and package-lock.json to the working directory first to leverage Docker's caching
COPY package*.json ./

# install app dependencies
RUN npm install

# copy the rest of our app's source code to the working directory
COPY . .

# expose the port the app runs on
EXPOSE 5001

# command to run the app
CMD ["npm", "run", "dev"]
