import axios from 'axios'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const C = require('./common')


export default (req, res) => {
  res.sendFile(path.join(__dirname, "../service-logs.html"))
}

export const buildReport = (dnaHash) => {
  const agents =
    C.getHostedApps()
    .filter(happ => happ.dnaHash === dnaHash)
    .map(happ => happ.agentHash)
  const promises = agents.map((agentHash) => {
    const port = C.getAccountantPort(agentHash)
    return axios
      .post(`http://localhost:${port}/fn/accountant/getLogBatch`)
      .then(r => r.data)
      .catch(err => ({error: err.message}))
  })
  return Promise.all(promises).then(bundles => {
    return bundles.map((bundle, i) => {
      // NB: might be error
      const agentHash = agents[i]
      // TODO: use this agentHash, the one in bundle is redundant right now
      return {agentHash, bundle}
    })
  })
}