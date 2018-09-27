import axios from 'axios'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const C = require('./common')
import {buildReport} from './service-logs'


export default (req, res) => {
  res.sendFile(path.join(__dirname, "../admin.html"))
}

export const api = {
  happs: {
    registered: (req, res) => {
      res.json(C.getRegisteredApps())
    },
    hosted: (req, res) => {
      res.json(C.getHostedApps())
    },
    serviceLogs: (req, res) => {
      const { dnaHash } = req.params
      buildReport(dnaHash).then(report => {
        res.json(report)
      })
    }
  }
}