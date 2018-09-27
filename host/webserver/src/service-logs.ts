import axios from 'axios'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const C = require('./common')


export default (req, res) => {
  res.sendFile(path.join(__dirname, "../service-logs.html"))
}

const buildReport = () => {
  C.getRegisteredApps()
}