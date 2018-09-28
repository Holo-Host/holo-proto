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

Now decide if you want to run in development mode for iterating on the code, or just build a "production-ready" assortment of containers with everything baked in.

### Development mode

For iterating on the code, you'll want to follow these steps to have the quickest turnaround time. You have to run some watch scripts to compile your TypeScript on the fly, and the first time you run, you'll have to run `yarn install` in three different directories.

#### Host service

You'll want to run watch scripts for the host server:

    cd ./host
    yarn install  # first time only
    npm run watch

And for the Accountant app

    cd ./host/hosting-happs
    yarn install  # first time only
    npm run watch

The current sample app is vanilla JS and has no build system, but does have npm dependencies, so go install them too:

    cd ./host/hosted-happs/sample-app-1
    yarn install  # first time only

Then, to spin up the containers, run the following (note the difference from the "production" command):

    docker-compose up

Note that by default `docker-compose.override.yml` will also be loaded, which contains extra configuration to map your local code into the containers for fast code editing.

### "Production-ready" build

After you've built the containers, simply invoke:

    docker-compose -f docker-compose.yml up

And all services will spin up. Eventually a web server will be available at http://localhost:8000

Note that by including the `-f` flag, `docker-compose.override.yml` is omitted from the configuration, which is what produces the production build.

## Usage

*TODO: move to own README once other components are built*

`docker-compose up` will install some apps for you to play with. Check `host/bin/startup` to see which apps are available. The installed DNAs will also be output during startup.

Once the container is fully running, a web server on port 8000 will be available to the host machine ("host" in the Docker sense, not the Holo sense!), and can start receiving requests.

### Making requests to hApps

Just send an HTTP request to the entry point:

```
POST http://localhost/dispatch:8000
{
    "agentHash": "agent007",
    "dnaHash": "QmbZeFchQ3gtc1ZUUpZSSsznZDjyeq1dJMBq12hCohpygH",
    "rpc": {
        "zome": "sampleZome",
        "func": "sampleEntryCreate",
        "args": {"text": "some text"}
    }
}
```

* `agentHash` can be anything, it is just used to distinguish different users. **NB**: make sure this is completely distinct, i.e. don't use the same agentHash for multiple DNAs.
* `dnaHash` is the hash of one of the apps which has been installed by the `startup` script.
* `rpc` contains the info for running the hosted zome function, and will ultimately result in a bridge call from the Accountant to the hosted DNA.

Note that the first time this function is called for a new Agent/DNA pair, a new agent will be set up, namely: 
* a new UNIX user will be created at `/agents/{agentHash}` 
* a new instance of the hApp, along with its Accountant, will be installed in the user's home directory

## What's going on here?

To get oriented, start at [docker-compose.yml](docker-compose.yml) to see what services get composed together. Take note of the volumes, which map local host directories into the container. Each service is in its own directory, for instance [host/](host/) contains the holo-hosting hApps. Check its [Dockerfile](host/Dockerfile) to see how the container gets built.

### The Host container ([./host](host))

See https://hackmd.io/izTLhcWQQBqZHAjXG0r_GA?both for much more detail.

The [`startup`](host/bin/startup) script initializes the host identity and environment, installs the hosted hApps, and starts running the web server at port 8000.

When the web server receives a valid request, it dispatches the request to the approprate agent's app ecosystem, or initializes the agent if it doesn't have a chain and user in this system yet.

### Other containers

**Not implemented yet!**. They will include the web proxy, perhaps an app store instance, and the "service introducer" that will serve up holo-loader.js stuff and get the browser introduced to the host.