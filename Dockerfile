# BrayanBot Dockerfile v0.1.0
# authors:
#  - NotAShelf <me@notashelf.dev> 
# Node 16 image

FROM node:16

# Set working directory and copy files into that directory
WORKDIR ./
COPY . .

# Update npm to at least npm 8,
# then install dependencies
RUN npm install -g npm@8 && npm install

# Start BrayanBot
CMD [ "npm", "start" ]

