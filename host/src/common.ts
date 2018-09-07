const fs = require('fs')
const path = require('path')

// Location for hosted agents' home directory (instead of /home)
export const AGENT_DIR = '/agents'

// Name to `hcd join` the app under
// (there's only one app per agent and this is it)
export const HOSTED_APP_NAME = 'happ'


export const getAgentHome = agentHash => path.join(AGENT_DIR, agentHash)

export const getUserDnaHash = agentHash => {
  const hashFile = path.join(
    getAgentHome(agentHash),
    '.holochain',
    HOSTED_APP_NAME,
    'dna.hash'
  )
  return fs.readFileSync(hashFile)
}

export const getAgentPort = agentHash => {
  const portFile = path.join(
    getAgentHome(agentHash),
    '.holo-port'
  )
  return parseInt(fs.readFileSync(portFile), 10)
}

const getInstalledUsers = () => {
  // axios.post(switchboardUrl('management', 'agents'))
  let hashes: Array<any> = []
  fs.readdir(C.AGENT_DIR, (err, hash) => {
    hashes.push(hash)
  })
  return hashes
}