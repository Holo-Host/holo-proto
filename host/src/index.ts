const axios = require('axios')
const express = require('express')
const fs = require('fs')

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

app.use('/dispatch', (req, res) => {
  const { identity, appHash, isSession, rpc } = req
  const agentHash = identity
  isAppRegisteredP(appHash).then((app) => {
    if (userExists(agentHash)) {
      if (appHash !== C.getUserDnaHash(agentHash)) {
        throw new Error(`App hash does not match installed user app: ${appHash}`)
      } else {
        handleRequest()
      }
    } else {
      createUser(identity).then(() => handleRequest())
    }
  }).catch((err) => {
    res.status(404).send(err)
  })

  const handleRequest = () => {
    const port = C.getAgentPort(agentHash)
    const url = `http://localhost:${port}/fn/requestTODO/handleTODO`
    axios.post(url).then((data) => res.json(data))
  }

})


const switchboardUrl = (zome, func) => `http://localhost:4000/fn/${zome}/${func}`

const isAppRegisteredP = (appHash: Hash) =>
  getRegisteredApps()
    .then(apps => apps.find(hash => appHash === hash))
    .then(app => {
      if (!app) {
        throw new Error(`App DNA is not registered with this host`)
      }
      return app
    })

const userExists = (agentHash: Hash): boolean =>
  C.getInstalledUsers().find(hash => agentHash === hash) !== undefined


const getRegisteredApps = () => {
  return axios.post(switchboardUrl('management', 'apps'))
}

const createUser = (identity): Promise<any> => {
  console.log("time to create ", identity)
  throw new Error('TODO')
  // exec(`./bin/spawn-agent ${identity}`)
}