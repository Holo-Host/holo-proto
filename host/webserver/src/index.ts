import axios from 'axios'
import * as bodyParser from 'body-parser'
import { spawn } from 'child_process'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'

import * as C from './common'
import admin, {api} from './admin'
import dispatch from './dispatch'

const app = express()

app.use(bodyParser.text())
app.use(bodyParser.json())

app.post('/dispatch', dispatch)
app.get('/', admin)
app.get('/api/happs/registered', api.happs.registered)
app.get('/api/happs/hosted', api.happs.hosted)
app.get('/api/happs/:dnaHash/service-logs', api.happs.serviceLogs)

app.listen(8000)
