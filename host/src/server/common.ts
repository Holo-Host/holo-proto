const fs = require('fs')
const path = require('path')

// Location for hosted agents' home directory (instead of /home)
const AGENT_DIR = '/agents'

// Name to `hcd join` the app under
// (there's only one app per agent and this is it)
const HOSTED_APP_NAME = 'happ'


const PROXY_PORT = 4000


const getAgentHome = agentHash => path.join(AGENT_DIR, agentHash)

const getUserDnaHash = agentHash => {
  const hashFile = path.join(
    getAgentHome(agentHash),
    '.holochain',
    HOSTED_APP_NAME,
    'dna.hash'
  )
  return fs.readFileSync(hashFile)
}

const getAgentPort = agentHash => {
  const portFile = path.join(
    getAgentHome(agentHash),
    '.holo-port'
  )
  return parseInt(fs.readFileSync(portFile), 10)
}

const getInstalledUsers = () => {
  // axios.post(switchboardUrl('management', 'agents'))
  let hashes: Array<any> = []
  fs.readdir(AGENT_DIR, (err, hash) => {
    hashes.push(hash)
  })
  return hashes
}

module.exports = {
  AGENT_DIR,
  HOSTED_APP_NAME,
  PROXY_PORT,
  getAgentHome,
  getUserDnaHash,
  getAgentPort,
  getInstalledUsers,
}