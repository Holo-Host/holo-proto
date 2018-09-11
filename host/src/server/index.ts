const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const path = require('path')

const C = require('./common')

const app = express()

type Hash = string

type DispatchRequest = {
  identity: Hash,
  appHash: Hash,
  isSession: boolean,
  rpc: {
    zome: string,
    func: string,
    args: any
  }
}

// Enable CORS
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// })

app.use(bodyParser.json())

app.post('/dispatch', (req, res) => {
  const { identity, appHash, isSession, rpc } = req.body
  const agentHash = identity
  if (isAppInstalled(appHash, res)) {
    if (userExists(agentHash)) {
      if (appHash !== C.getUserDnaHash(agentHash)) {
        throw new Error(`App hash does not match installed user app: ${appHash}`)
      } else {
        handleRequest()
      }
    } else {
      createUser(identity).then(() => handleRequest())
    }
  }

  const handleRequest = () => {
    const port = C.getAgentPort(agentHash)
    const url = `http://localhost:${port}/fn/requestTODO/handleTODO`
    axios.post(url).then((data) => res.json(data)).catch(err => console.error(err))
  }
})

app.listen(8000)

const switchboardUrl = (zome, func) => `http://localhost:${C.PROXY_PORT}/fn/${zome}/${func}`

const isAppInstalled = (appHash: Hash, res) => {
  const hashes = getInstalledApps()
  const found = hashes.find(hash => hash === appHash) !== undefined
  if (!found) {
    const hashesDisplay = hashes.map(h => `- ${h}`).join("\n")
    res.status(404).send(
`App DNA is not registered with this host: ${appHash}.
${hashes.length} Available hashes:
${hashesDisplay}`
    )
    return false
  }
  return true
}

const isAppRegisteredP = (appHash: Hash) =>
  getRegisteredApps()
    .then(entries => {
      const hashes = entries.data.map(app => app.appHash)
      const app = hashes.find(hash => appHash === hash)
      if (!app) {
        const hashesDisplay = hashes.map(h => `- ${h}`).join("\n")
        throw new Error(
`App DNA is not registered with this host: ${appHash}.
${hashes.length} Available hashes:
${hashesDisplay}`
        )
      }
      return app
    })

const userExists = (agentHash: Hash): boolean =>
  C.getInstalledUsers().find(hash => agentHash === hash) !== undefined

const getInstalledApps = () => {
  const base = '/root/.holochain'
  const items = fs.readdirSync('/root/.holochain', {withFileTypes: true})
  const dirs = items.filter(item => item.isDirectory() && item.name !== 'switchboard')
  return dirs.map((item) => {
    return fs.readFileSync(path.join(base, item.name, 'dna.hash'), 'utf8')
  })
}

const getRegisteredApps = () => {
  return axios.post(switchboardUrl('management', 'getRegisteredApps')).catch(err => {throw new Error("getRegisteredApps: ", err)})
}

const createUser = (identity): Promise<any> => {
  console.log("time to create ", identity)
  throw new Error('TODO')
  // exec(`./bin/spawn-agent ${identity}`)
}