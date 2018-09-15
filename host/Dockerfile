FROM holochain/holochain-proto:develop

RUN apt-get update
RUN apt-get install -y sudo curl apt-utils gnupg

# for yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# for node
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

RUN apt-get update
RUN apt-get install -y yarn nodejs jq net-tools

WORKDIR /root

# install npm packages
ADD ./package.json .
RUN yarn install

# build webserver
ADD ./src src
ADD ./tsconfig.json .
RUN npm run build

# set up scripts & directory structure
ADD ./bin /bin-holo
RUN chmod -R a+x /bin-holo
RUN ln -s /bin-holo ./bin
ADD ./hosted-happs /hosted-happs
RUN mkdir /agents

# enter the holo host
CMD /bin-holo/startup
