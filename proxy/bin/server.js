const express = require('express');
const httpProxy = require('http-proxy')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const PROXY_PORT = 4000
const TARGET_PORT = 4000

function startProxyServer() {

  const proxy = httpProxy.createProxyServer({target: `http://localhost:${TARGET_PORT}`})
  const app = express();

  const target = `http://localhost:${TARGET_PORT}`;

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

  app.use('/', function(req, res) {
    proxy.web(req, res, {target})
    // const url = target + req.url;
    // req.pipe(request(url)).pipe(res);
  });

  app.listen(PROXY_PORT)
}

startProxyServer()