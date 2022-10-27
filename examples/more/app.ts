import { AxiosError } from './../../src/helpers/error'
import axios from '../../src/index'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
console.log(NProgress)

document.cookie = 'a=2'

axios.get('/more/get').then(res => {
  console.log(res)
})

// axios
//   .post(
//     'http://127.0.0.1:8088/more/server2',
//     {
//       cookies: 'cookies'
//     },
//     {
//       withCredentials: true
//     }
//   )
//   .then(res => {
//     console.log(res)
//   })

const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get').then(res => {
  console.log('xsrf', res)
})

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 1.0) / total
}

function loadProgressBar() {
  const setupStartProgress = () => {
    instance.interceptors.request.use(config => {
      console.log('start')

      NProgress.start()
      return config
    })
  }

  const setupUpdateProgress = () => {
    const update = (e: ProgressEvent) => {
      console.log(e)
      NProgress.set(calculatePercentage(e.loaded, e.total))
    }
    instance.defaults.onDownloadProgress = update
    instance.defaults.onUploadProgress = update
  }

  const setupStopProgress = () => {
    instance.interceptors.response.use(
      response => {
        NProgress.done()
        return response
      },
      error => {
        NProgress.done()
        return Promise.reject(error)
      }
    )
  }

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
}

loadProgressBar()

const downloadEl = document.getElementById('download')

downloadEl?.addEventListener('click', e => {
  instance.get('http://backstageimgtest.static.ligujoy.com/2020052814261390_8443.jpg')
})

const uploadEl = document.getElementById('upload')

uploadEl?.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    instance.post('/more/upload', data)
  }
})

axios
  .post(
    '/more/post',
    {
      ab: 1
    },
    {
      auth: {
        username: 'wang',
        password: '123b'
      }
    }
  )
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  })

axios
  .get('/more/304')
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
  })

axios
  .get('/more/304', {
    validateStatus(status) {
      return status >= 200 && status < 400
    }
  })
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
  })


  axios.get('/more/get', {
    params: new URLSearchParams('a=b&c=d')
  }).then(res => {
    console.log(res)
  })

  axios.get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c']
    }
  }).then(res => {
    console.log(res)
  })

  const instance = axios.create({
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  })

  console.log(qs.stringify({
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }, { arrayFormat: 'brackets' }));


  instance.get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c']
    }
  }).then(res => {
    console.log(res)
  })
