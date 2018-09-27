import axios from 'axios'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

import * as C from './common'
import {Hash} from './common'

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

export default (req, res) => {

  const { agentHash, dnaHash, isSession, rpc } = req.body

  if (!agentHash || !dnaHash || !rpc) {
    res.status(400).send('missing required param(s)')
    return
  }

  const handleRequest = () => {
    const port = C.getAccountantPort(agentHash)
    const url = `http://localhost:${port}/fn/accountant/handleRequest`
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

  if (C.isAppInstalled(dnaHash, res)) {
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
}

const userExists = (agentHash: Hash): boolean =>
  C.getInstalledUsers().find(hash => agentHash === hash) !== undefined

const getAppByHash = dnaHash => C.getRegisteredApps().find(app => app.hash === dnaHash)

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