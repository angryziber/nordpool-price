import express from 'express'
import morgan from 'morgan'
import 'express-async-errors'
import {jsonRequest} from './jsonRequest.js'
import {extractPrices} from './prices.js'
import countries from '../static/countries.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

morgan.token('remote-addr', req => req.headers['x-forwarded-for'] || req.connection.remoteAddress)
morgan.token('body', req => JSON.stringify(req.body))
const logger = morgan('[:date] :remote-addr :method :url :body :status :res[content-length] :referrer :user-agent - :response-time ms', {
  skip: req => req.header('User-Agent')?.includes('UptimeRobot')
})
app.use(logger)

app.get('/api/prices', async (req, res) => {
  const country = req.query.country ?? 'EE'
  const hourOffset = req.query.hourOffset - countries[country].hourDiff

  const start = new Date()
  start.setDate(start.getDate() - 7)
  start.setUTCHours(-hourOffset)
  start.setUTCMinutes(0)
  start.setUTCSeconds(0)

  const end = new Date()
  end.setDate(end.getDate() + 2)
  start.setUTCHours(-hourOffset)
  start.setUTCMinutes(0)
  start.setUTCSeconds(0)

  const url = {
    host: 'dashboard.elering.ee',
    path: `/api/nps/price?start=${start.toISOString()}&end=${end.toISOString()}`
  }
  const r = await jsonRequest(url, res)
  res.header('cache-control', 'max-age=3600')
  return r.statusCode === 200 ? res.json(extractPrices(JSON.parse(r.text), country, hourOffset)) : res.send(r.text)
})

app.use(express.static('static'))

const port = 7070
app.listen(port, () => console.log(`Listening on port ${port}`))
