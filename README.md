# holo-prototype

A collection of all interrelated Holo code bases glued together with docker-compose and <3

* https://github.com/Holo-Host/holo-host
* https://github.com/Holo-Host/holo.js
* https://github.com/Holo-Host/holojs-sample-app

## Installation

First grab the submodules with:

    git submodule init && git submodule update

Have Docker installed. Then build the containers with:

    docker-compose build

Now decide if you want to run in development mode for iterating on the code, or just bake a "production-ready" assortment of containers with everything baked in.

### "Production-ready" build

After you've built the containers, simply invoke:

    docker-compose -f docker-compose.yml up

And all services will spin up. Eventually a web server will be available at http://localhost:8000

### Development mode

For iterating on the code, your final docker-compose command will be different, and you'll have to run some watch scripts to compile your TypeScript on the fly. Additionally, you might choose to only run one containered service at a time.

#### Host service

You'll want to run watch scripts for the host server:

    cd ./host
    npm run watch

And for the hosting apps (switchboard and accountant)

    cd ./host/hosting-happs
    npm run watch

(The current sample app is pure JS and has no build system.)

Then, to spin up the containers, run the following (note the difference from the "production" command):

    docker-compose up

By omitting the -f flag, docker-compose also loads `docker-compose.override.yml`, which contains extra configuration to map your local code into the containers for fast code editing.

## Usage

> NB: Here, "host machine" is used in the Docker sense, not the Holo sense. Confusingly, the host machine is the machine of the person reading this, and the containered app is the Holo host environment.

Once the container is fully running, a web server on port 8000 will be available to the host machine. This communicates with a Switchboard hApp running on port 4000 (not exposed). 

So, to kick things off, since there is no Holo-enabled UI set up yet, just send an HTTP request to the entry point:

```
POST http://localhost/dispatch:8000
{
    "agentHash": "a1",
    "appHash": "QmbZeFchQ3gtc1ZUUpZSSsznZDjyeq1dJMBq12hCohpygH",
    "rpc": {
        "zome": "sampleZome",
        "func": "sampleEntryCreate",
        "args": {"text": "some more text"}
    }
}
```

This will send a request through the Holo system running in the Docker container, targeting the sample app (see [sample-app-1](host/hosted-happs/sample-app-1)). Note you will have to change the `appHash` parameter here as the sample app's DNA changes.

## What's going on here?

To get oriented, start at [docker-compose.yml](docker-compose.yml) to see what services get composed together. Take note of the volumes, which map local host directories into the container. Each service is in its own directory, for instance [host/](host/) contains the holo-hosting hApps. Check its [Dockerfile](host/Dockerfile) to see how the container gets built.

### The Host container ([./host](host))

See https://hackmd.io/izTLhcWQQBqZHAjXG0r_GA?both for much more detail.

The [`startup`](host/bin/startup) script initializes the host identity and environment, installs the hosted hApps, and starts running the host's Switchboard instance as well as the web server at port 8000.

When the web server receives a valid request, it dispatches the request to the approprate agent's app ecosystem, or initializes the agent if it doesn't have a chain and user in this system yet.

### Other containers

**Not implemented yet!**. They will include the web proxy, perhaps an app store instance, and the "service introducer" that will serve up holo-loader.js stuff and get the browser introduced to the host.