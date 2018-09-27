
import * as fs from 'fs'
import * as path from 'path'

export type Hash = string

// Location for hosted agents' home directory (instead of /home)
const AGENT_DIR = '/agents'

// Name to `hcd join` the app under
// (there's only one app per agent and this is it)
const HOSTED_APP_NAME = 'happ'


export const getAgentHome = agentHash => path.join(AGENT_DIR, agentHash)

export const getUserDnaHash = agentHash => {
  const hashFile = path.join(
    getAgentHome(agentHash),
    '.holochain',
    HOSTED_APP_NAME,
    'dna.hash'
  )
  return fs.readFileSync(hashFile, 'utf8').trim()
}

export const getAccountantPort = agentHash => {
  const portFile = path.join(
    getAgentHome(agentHash),
    '.holo-accountant-port'
  )
  return parseInt(fs.readFileSync(portFile, 'utf8'), 10)
}

export const getInstalledUsers = () => {
  return fs.readdirSync(AGENT_DIR)
}

export const isAppInstalled = (dnaHash: Hash, res) => {
  const hashes = getRegisteredApps().map(app => app.hash)
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

/**
 * Get the apps that have been enabled for hosting
 */
export const getRegisteredApps = () => {
  const base = '/root/.holochain'
  // @ts-ignore: needs 10.10.0^ types for withFileTypes
  const items = fs.readdirSync('/root/.holochain', {withFileTypes: true})
  // NB: if ever installing other hApps in host-space, ignore them here
  const dirs = items.filter(item => item.isDirectory())
  return dirs.map((item) => {
    const { name } = item
    const appDir = path.join(base, name, 'dna.hash')
    const hash = fs.readFileSync(appDir, 'utf8')
    return { name, hash }
  })
}

/**
 * Get the instances of apps which are running on behalf of users
 * @type {[type]}
 */
export const getHostedApps = () => {
  let appNames = {}
  getRegisteredApps().forEach(({name, hash}) => {
    appNames[hash] = name
  })
  return getInstalledUsers().map(agentHash => {
    const dnaHash = getUserDnaHash(agentHash)
    const appName = appNames[dnaHash]
    return { agentHash, dnaHash, appName }
  })
}
