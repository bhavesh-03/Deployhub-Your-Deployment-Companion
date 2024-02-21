FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

RUN apt-get install -y git

WORKDIR /home/app

COPY main.sh main.sh
COPY script.js script.js
COPY package*.json  .

RUN npm install


# Exeuatable permissions
RUN chmod +x main.sh
RUN chmod +x script.js


# When container is up and running it will automaticly run the entrypoint
ENTRYPOINT [ "/home/app/main.sh" ]