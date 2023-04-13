FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

#RUN apk update && \
#    apk upgrade -U && \
#    apk add ca-certificates ffmpeg libwebp libwebp-tools && \
#    rm -rf /var/cache/*
#
#RUN apk add python3
#RUN apk add build-base
#
#RUN apk add chromium

RUN npm install -f

COPY . .

RUN npm run build

CMD ["node", "dist/main"]