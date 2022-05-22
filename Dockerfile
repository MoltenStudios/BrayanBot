# BrayanBot Dockerfile v0.1.3
# authors:
#  - NotAShelf <me@notashelf.dev>
<<<<<<< HEAD
# Node 17-alpine
FROM node:17-alpine

# Update the system
RUN apk update && apk add git ca-certificates
=======
# Node 18.2.0
# TODO: Switch to pnpm inside Docker

# From Node 19 Alpine image
FROM node:18-alpine
LABEL MAINTAINER="NotAShelf <raf@brayanbot.dev>"

# update packages
RUN apk update && apk add --no-cache git ca-certificates make gcc g++ bash
>>>>>>> e242315 (switch to node18-alpine from node17 img)

# Set working directory
WORKDIR /opt/brayanbot

<<<<<<< HEAD
COPY package.json ./
RUN npm install -g npm@8 && npm install --save-dev

# and copy files into that directory (config.yml, modules etc.)
COPY . ./

# Ensure these directories & files exist for compose volumes
RUN touch /opt/brayanbot/config.yml && \
    touch /opt/brayanbot/lang.yml && \
    touch /opt/brayanbot/commands.yml && \
    touch /opt/brayanbot/WebServer/webserver.yml 
=======
# And copy files into that directory (config.yml, modules etc.)
COPY . ./

# Install dependencies
RUN yarn

# Ensure these directories & files exist for compose volumes
RUN touch /opt/brayanbot/lang.yml && \
    touch /opt/brayanbot/commands.yml && \
    cp /opt/brayanbot/example.config.yml /opt/brayanbot/config.yml
>>>>>>> e242315 (switch to node18-alpine from node17 img)


<<<<<<< HEAD
ENTRYPOINT [ "npm", "start" ]
=======
# Clean Yarn cache
RUN yarn cache clean

# Start the bot
CMD [ "yarn", "start" ]
>>>>>>> e242315 (switch to node18-alpine from node17 img)

