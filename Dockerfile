FROM node:12-alpine

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Install deps
RUN yarn

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN yarn build

CMD yarn start