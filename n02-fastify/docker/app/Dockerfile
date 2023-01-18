FROM node:16-alpine3.15
ENV NODE_ENV production

# Set 0.0.0.0 to host when starting with docker
# server.listen({ port: 3000, host: '0.0.0.0' }

WORKDIR /nodejs_comx

RUN apk add --no-cache tini bash
ENTRYPOINT ["/sbin/tini", "--"]

COPY package.json ./
# COPY . .

ADD docker/app/entrypoint.sh /
RUN chmod a+x /entrypoint.sh

# USER node
RUN npm install

CMD ["/entrypoint.sh"]
