import express from 'express'
import morgan from 'morgan'
import 'express-async-errors'
import {jsonRequest} from './jsonRequest.js'
import {extractPrices} from './prices.js'

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

  const start = new Date()
  start.setDate(start.getDate() - 10)
  start.setHours(0)
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)

  const end = new Date(start)
  end.setDate(end.getDate() + 12)

  const url = {
    host: 'dashboard.elering.ee',
    path: `/api/nps/price?start=${start.toISOString()}&end=${end.toISOString()}`
  }
  const r = await jsonRequest(url, res)
  res.header('cache-control', 'max-age=3600')
  return r.statusCode === 200 ? res.json(extractPrices(JSON.parse(r.text), country, 1)) : res.send(r.text)
})

app.use(express.static('dist'))

const port = 7070
app.listen(port, () => console.log(`Listening on port ${port}`))
