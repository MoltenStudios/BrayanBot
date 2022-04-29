# BrayanBot Dockerfile v0.1.3
# authors:
#  - NotAShelf <me@notashelf.dev>
# Node 17-alpine
FROM node:17-alpine

# Update the system
RUN apk update && apk add git ca-certificates

# Set working directory
WORKDIR /opt/brayanbot

COPY package.json ./
RUN npm install -g npm@8 && npm install --save-dev

# and copy files into that directory (config.yml, modules etc.)
COPY . ./

# Ensure these directories & files exist for compose volumes
RUN touch /opt/brayanbot/config.yml && \
    touch /opt/brayanbot/lang.yml && \
    touch /opt/brayanbot/commands.yml && \
    touch /opt/brayanbot/WebServer/webserver.yml 

# Create a config.yml based on example config
# and then start BrayanBot

ENTRYPOINT [ "npm", "start" ]

