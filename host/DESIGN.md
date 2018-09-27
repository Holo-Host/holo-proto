
## Admin interface

#### Install hApp
/fn/management/install
* in
    - path
* out
    - dnaHash

#### View all logs for all hApps (with filtering, etc.)
/fn/accountant/report
* in
    - optional filter params
* out
    - structured report

#### Create invoice for redemption
/fn/accountant/invoice
* in
    - app dnaHash
    - date range?
* out
    - hash of private entry


## App side

* Must be able to connect hApp to 

### Connection

HOST:
Management app installed

AGENT:
Custom Accountant app
bridged as a callee of the management app
bridged as the caller to a Single hosted hApp,

### Bridging vs. direct http

The dispatch function must use http requests directly to the agent's space, since it induces the agent to act. Can't be done by bridging.

Reading service logs could be done through the network. But it seems a little silly, why validate and gossip when it's all on one machine?

Installing an app requires filesystem stuff

Conclusion: let's just use plain http servers on the host side. No hApps at all, they just call into the agents' accountants. The agents don't really need a switchboard anymore, either. However, we're already doing it that way. So:

* Accountant on the host side can get transaction reports through HC, we **could** do it that way, but nah
* Switchboard on the host side **can** get registered apps through HC (from bridgeGenesis) but again let's **not** do it that way, just use web server
* There is no management hApp, it's just a web server

So there is an Admin web app that runs in the host space. 
* It mucks with the filesystem directly to install apps as well as to discover what apps are installed. 
* It sends requests to Accountants directly for dispatch
* It requests service logs from Accountants directly, aggregates them.
