# BrayanBot Dockerfile v0.1.3
# authors:
#  - NotAShelf <me@notashelf.dev>
# Node 18.2.0
# TODO: Switch to pnpm inside Docker

# From Node 19 Alpine image
FROM node:18-alpine
LABEL MAINTAINER="NotAShelf <raf@brayanbot.dev>"

# update packages
RUN apk update && apk add --no-cache git ca-certificates make gcc g++ bash

# Set working directory
WORKDIR /opt/brayanbot

# And copy files into that directory (config.yml, modules etc.)
COPY . ./

# Install dependencies
RUN yarn

# Ensure these directories & files exist for compose volumes
RUN touch /opt/brayanbot/lang.yml && \
    touch /opt/brayanbot/commands.yml && \
    cp /opt/brayanbot/example.config.yml /opt/brayanbot/config.yml


# Clean Yarn cache
RUN yarn cache clean

# Start the bot
CMD [ "yarn", "start" ]

