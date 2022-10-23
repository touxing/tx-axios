import axios, { Cancel } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(e => {
  if(axios.isCancel(e)) {
    console.log('Request canceled', e.message);
  }
})

setTimeout(() => {
  source.cancel('Operation canceled by the user')
  axios.post('/cancel/post', { a: 1 }, {
    cancelToken: source.token
  }).catch(e => {
    if(axios.isCancel(e)) {
      console.log('/cancel/post', e.message);
    }
  })
}, 100);

let cancel: Cancel

axios.get('/cancel/get?a=hello', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(e => {
  if(axios.isCancel(e)) {
    console.log('Request canceled 2');
  }
})

setTimeout(() => {
  cancel()
}, 1200);
