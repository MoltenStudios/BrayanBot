# BrayanBot Dockerfile v0.1.0
# authors:
#  - NotAShelf <me@notashelf.dev> 
# Node 17 image

FROM node:17.3.0

# Set working directory
WORKDIR ./

# Update npm to at least npm 8,
# then install dependencies
RUN npm i -g npm@8 typescript && \
    npm i --save-dev && \
    npm run build

# Start BrayanBot
CMD npm run start
