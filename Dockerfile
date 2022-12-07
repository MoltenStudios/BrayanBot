# BrayanBot Dockerfile v2.0.0
# authors:
#  - NotAShelf <me@notashelf.dev>
#  - XCraftMan52 <lucas@lucaswebber.net>
# Node 18.2.0

# From Node 18 Alpine image
FROM node:18-alpine

LABEL MAINTAINER="NotAShelf <raf@brayanbot.dev>"

# Set working directory
WORKDIR /opt/brayanbot

# Download and Install pnpm
RUN apk add --no-cache curl \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node

# And copy files into that directory
COPY . ./

# fetch packages from pnpm-lock.yaml
RUN pnpm fetch 

# Install dependencies
RUN pnpm install -r 

# Ensure these directories & files exist for compose volumes
RUN touch /opt/brayanbot/data

# Start the bot
CMD [ "pnpm", "start" ]

