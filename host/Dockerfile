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
RUN apt-get install -y less procps vim


### MAKE SURE EVERYTHING ABOVE THIS LINE IS IN SYNC WITH Dockerfile-prod ###


WORKDIR /root

# set up scripts & directory structure
RUN ln -s /bin-holo ./bin
RUN mkdir /agents

# enter the holo host
CMD /bin-holo/startup
