# BryanBot Dockerfile v2.0.2
# authors:
#  - NotAShelf <raf@notashelf.dev>
#  - XCraftMan52 <lucas@lucaswebber.net>
# Node 18.2.0

# From Node 18 Alpine image
FROM node:18-alpine as base

# Set maintainer
LABEL MAINTAINER="NotAShelf <raf@neushore.dev>"

# Install pnpm 
RUN npm i -g pnpm

FROM base as dependencies

# Set working directory
WORKDIR /opt/bryanbot

# And copy files into that directory
COPY . ./

# fetch packages from pnpm-lock.yaml
RUN pnpm fetch 

# Install dependencies
RUN pnpm install -r --no-frozen-lockfile

FROM dependencies as deploy

# Make sure the data directory exists so that we can mount it
RUN mkdir -p /opt/bryanbot/data

# Start the bot with the BOT_PLATFORM environment variable set to Docker
# This allows the bot to decide the correct error message(s)
RUN export BOT_PLATFORM=Docker
CMD [ "pnpm", "start" ]
