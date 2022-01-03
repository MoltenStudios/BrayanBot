# BrayanBot Dockerfile v0.1.1
# authors:
#  - NotAShelf <me@notashelf.dev> 
# Node 16

FROM node:16.6.0

# Set working directory 
WORKDIR /opt/brayanbot
# and copy files into that directory (config.yml, modules etc.)
COPY . ./

RUN npm install -g npm@8 && npm install --save-dev

# Ensure these directories & files exist for compose volumes
RUN touch /opt/brayanbot/config.yml && \
    touch /opt/brayanbot/lang.yml && \
    touch /opt/brayanbot/commands.yml

# Create a config.yml based on example config 
# and then start BrayanBot

CMD npm start

