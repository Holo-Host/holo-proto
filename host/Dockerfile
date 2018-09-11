FROM holochain/holochain-proto:develop

RUN apt-get update
RUN apt-get install -y sudo curl apt-utils gnupg

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

RUN apt-get update
RUN apt-get install -y yarn nodejs

WORKDIR /root
ADD ./package.json .
RUN yarn install

ADD ./bin bin
RUN chmod -R a+x ./bin

ADD ./hosted-happs hosted-happs

CMD bin/startup
