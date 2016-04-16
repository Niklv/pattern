FROM node

RUN mkdir -p www/pattern 
WORKDIR www/pattern
ADD . .
RUN npm i -g bower grunt-cli && \
    echo '{ "allow_root": true }' > /root/.bowerrc && \
    npm i && \
    bower i && \
    grunt -v

EXPOSE 20200

CMD ["npm", "start"]
