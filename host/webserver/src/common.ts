
import * as fs from 'fs'
import * as path from 'path'

// Location for hosted agents' home directory (instead of /home)
const AGENT_DIR = '/agents'

// Name to `hcd join` the app under
// (there's only one app per agent and this is it)
const HOSTED_APP_NAME = 'happ'


const getAgentHome = agentHash => path.join(AGENT_DIR, agentHash)

const getUserDnaHash = agentHash => {
  const hashFile = path.join(
    getAgentHome(agentHash),
    '.holochain',
    HOSTED_APP_NAME,
    'dna.hash'
  )
  return fs.readFileSync(hashFile, 'utf8').trim()
}

const getAccountantPort = agentHash => {
  const portFile = path.join(
    getAgentHome(agentHash),
    '.holo-accountant-port'
  )
  return parseInt(fs.readFileSync(portFile, 'utf8'), 10)
}

const getInstalledUsers = () => {
  return fs.readdirSync(AGENT_DIR)
}

module.exports = {
  AGENT_DIR,
  HOSTED_APP_NAME,
  getAgentHome,
  getUserDnaHash,
  getAccountantPort,
  getInstalledUsers,
}