const express = require('express')
const bodyParser = require('body-parser')
const cookieParse = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParse())

const router = express.Router()
app.use(router)

const cors = {
  'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

router.post('/more/server2', (req, res) => {
  res.set(cors)
  res.json(req.cookies)
})

router.options('/more/server2', (req, res) => {
  res.set(cors)
  res.end()
})

const port = 8088
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://127.0.0.1:${port}, Ctrl+C to stop`)
})
