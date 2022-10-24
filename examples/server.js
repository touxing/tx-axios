const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

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

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
// create application/json parser
app.use(bodyParser.json())
// 中间件引入顺序有依赖关系
app.use(router)

registeBaseRouter()
registeSimpleRouter()
registeExtendRouter()
registeInterceptor()
registeConfig()
registeCancel()
registeMore()

function registeBaseRouter() {
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

function registeSimpleRouter() {
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

function registeExtendRouter() {
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

function registeInterceptor() {
  router.get('/interceptor/get', function(req, res) {
    res.json('hello')
  })
}

function registeConfig() {
  router.post('/config/post', function(req, res) {
    res.json(req.body)
  })
}

function registeCancel() {
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

function registeMore() {
  router.get('/more/get', function(req, res) {
    // res.json(req.query)
    res.end()
  })
}

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
