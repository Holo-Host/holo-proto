import axios from 'axios'
import * as bodyParser from 'body-parser'
import { spawn } from 'child_process'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'

const C = require('./common')

const app = express()

type Hash = string

interface DispatchRequest {
  agentHash: Hash;
  dnaHash: Hash;
  isSession: boolean;
  rpc: {
    zome: string,
    func: string,
    args: any
  };
}

// Enable CORS
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// })

app.use(bodyParser.text())
app.use(bodyParser.json())

app.post('/dispatch', (req, res) => {

  const { agentHash, dnaHash, isSession, rpc } = req.body

  if (!agentHash || !dnaHash || !rpc) {
    res.status(400).send('missing required param(s)')
    return
  }

  const handleRequest = () => {
    const port = C.getAgentPort(agentHash)
    const url = switchboardUrl(port, 'switchboard', 'dispatch')
    console.log(`Calling ${url}:${port}`)
    axios.post(url, rpc)
      .then(payload => {
        res.status(payload.status).json(payload.data)
      })
      .catch(err => {
        const { request, response } = err
        if (response) {
          console.log(response.data)
          res.status(response.status).send(response.data)
        } else {
          const msg = "RPC failed: " + err.message + ". Is the service running?"
          res.status(500).send(msg)
        }
      })
      .catch(err => {
        console.error("Really bad error!! (Probably undefined response): ", err)
        res.status(500).send(err)
      })
  }

  if (isAppInstalled(dnaHash, res)) {
    if (userExists(agentHash)) {
      console.log('user exists...')
      const foundHash = C.getUserDnaHash(agentHash)
      if (dnaHash !== foundHash) {
        throw new Error(`App hash does not match installed user app: '${dnaHash}' vs. '${foundHash}'`)
      } else {
        handleRequest()
      }
    } else {
      console.log('ready to create user...')
      createUser(agentHash, dnaHash).then(() => handleRequest())
    }
  }

})

app.listen(8000)

const switchboardUrl = (port, zome, func) => `http://localhost:${port}/fn/${zome}/${func}`

const isAppInstalled = (dnaHash: Hash, res) => {
  const hashes = getInstalledApps().map(app => app.hash)
  const found = hashes.find(hash => hash === dnaHash) !== undefined
  if (!found) {
    const hashesDisplay = hashes.map(h => `- ${h}`).join("\n")
    res.status(404).send(
`App DNA is not registered with this host: ${dnaHash}.
${hashes.length} Available hashes:
${hashesDisplay}`
    )
    return false
  }
  return true
}

const isAppRegisteredP = (dnaHash: Hash) =>
  getRegisteredApps()
    .then(entries => {
      const hashes = entries.data.map(app => app.dnaHash)
      const app = hashes.find(hash => dnaHash === hash)
      if (!app) {
        const hashesDisplay = hashes.map(h => `- ${h}`).join("\n")
        throw new Error(
`App DNA is not registered with this host: ${dnaHash}.
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
  // @ts-ignore: needs 10.10.0^ types for withFileTypes
  const items = fs.readdirSync('/root/.holochain', {withFileTypes: true})
  const dirs = items.filter(item => item.isDirectory() && item.name !== 'switchboard')
  return dirs.map((item) => {
    const { name } = item
    const appDir = path.join(base, name, 'dna.hash')
    const hash = fs.readFileSync(appDir, 'utf8')
    return { name, hash }
  })
}

const getAppByHash = dnaHash => getInstalledApps().find(app => app.hash === dnaHash)

const getRegisteredApps = () => {
  return axios.post(switchboardUrl(C.SWITCHBOARD_PORT, 'management', 'getRegisteredApps')).catch(err => {throw new Error('getRegisteredApps: ' + err)})
}

const createUser = (agentHash, dnaHash): Promise<any> => {
  const app = getAppByHash(dnaHash)
  return new Promise((fulfill, reject) => {
    if (app) {
      console.log(`spawning agent for app: ${JSON.stringify(app)}`)
      const proc = spawn(`/bin-holo/spawn-agent`, [agentHash, app.name, app.hash])
      proc.stdout.on('data', data => console.log(`spawn: ${data}`))
      proc.stderr.on('data', data => console.error(`spawn (err): ${data}`))
      proc.on('exit', code => {
        if (code !== 0) {
          reject(`Could not spawn new agent. Code: ${code}`)
        } else {
          fulfill()
        }
      })
    } else {
      reject(`No app installed with hash: ${dnaHash}`)
    }
  })
}