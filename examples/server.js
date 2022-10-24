const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const path = require('path')
const multiparty = require('connect-multiparty')
const atob = require('atob')

const app = express()
const compiler = webpack(WebpackConfig)
const router = express.Router()

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)

app.use(webpackHotMiddleware(compiler))

app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-TOKEN-D', '1234abc')
    }
  })
)
app.use(
  multiparty({
    uploadDir: path.resolve(__dirname, 'upload-file')
  })
)

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
// create application/json parser
app.use(bodyParser.json())
// 中间件引入顺序有依赖关系
app.use(router)

registerBaseRouter()
registerSimpleRouter()
registerExtendRouter()
registerInterceptor()
registerConfig()
registerCancel()
registerMore()

function registerBaseRouter() {
  router.get('/base/get', function(req, res) {
    res.json(req.query)
  })

  router.post('/base/post', function(req, res) {
    res.json(req.body)
  })

  router.post('/base/buffer', function(req, res) {
    let msg = []
    req.on('data', chunk => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', () => {
      let buf = Buffer.concat(msg)
      res.json(buf.toJSON())
    })
  })
}

function registerSimpleRouter() {
  router.get('/simple/get', function(req, res) {
    res.json({
      msg: `hello world`
    })
  })
}

router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})

function registerExtendRouter() {
  router.get('/extend/get', function(req, res) {
    res.json({ msg: 'get' })
  })

  router.options('/extend/options', function(req, res) {
    res.end()
  })
  router.head('/extend/head', function(req, res) {
    res.end()
  })
  router.patch('/extend/patch', function(req, res) {
    res.end()
  })
  router.delete('/extend/delete', function(req, res) {
    res.end()
  })
  router.put('/extend/put', function(req, res) {
    res.json(req.body)
  })
  router.post('/extend/post', function(req, res) {
    res.json(req.body)
  })

  router.get('/extend/user', function(req, res) {
    res.json({
      code: 200,
      message: 'success',
      result: {
        name: 'LiSanTer',
        age: 18
      }
    })
  })
}

function registerInterceptor() {
  router.get('/interceptor/get', function(req, res) {
    res.json('hello')
  })
}

function registerConfig() {
  router.post('/config/post', function(req, res) {
    res.json(req.body)
  })
}

function registerCancel() {
  router.get('/cancel/get', function(req, res) {
    setTimeout(() => {
      res.json(req.query)
    }, 1000)
  })
  router.post('/cancel/post', function(req, res) {
    setTimeout(() => {
      res.json(req.body)
    }, 1000)
  })
}

function registerMore() {
  router.get('/more/get', function(req, res) {
    // res.json(req.query)
    res.end()
  })

  router.post('/more/upload', function(req, res) {
    console.log(req.body, req.files)
    res.end('upload success!')
  })

  router.post('/more/post', function(req, res) {
    const { authorization: auth } = req.headers
    const [type, credentials] = auth.split(' ')
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'wang' && password === '123b') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })
}

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
