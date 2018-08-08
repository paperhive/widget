FROM nginx

ENV PAPERHIVE_BASE_URL="https://paperhive.org"

COPY build/index.html /usr/share/nginx/html/index.html
COPY build/index.js /index.js
COPY docker-config.js /config.js

CMD [ "bash", "-c", "envsubst '$PAPERHIVE_BASE_URL' < /config.js | cat - /index.js > /usr/share/nginx/html/index.js && exec nginx -g 'daemon off;'" ]
