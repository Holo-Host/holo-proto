# holo-prototype

A collection of all interrelated Holo code bases glued together with docker-compose and <3

* https://github.com/Holo-Host/holo-host
* https://github.com/Holo-Host/holo.js
* https://github.com/Holo-Host/holojs-sample-app

## Installation

Just have Docker installed, and:

    docker-compose up

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