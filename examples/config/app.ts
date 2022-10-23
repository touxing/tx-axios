import { AxiosTransformer } from './../../src/types/index'
import axios from '../../src/index'

axios.defaults.headers.common['test-token'] = 'testtoken'+Date.now()

let data = new URLSearchParams({
  age: 18,
  name: 'Lili'
}).toString()

console.log(data);


axios({
  url: '/config/post',
  method: 'post',
  data: data,
  headers: {
    test: 'test-head'
  }
}).then(res => {
  console.log(res.data);
})

axios({
  transformRequest: [
    (function(data) {
      return new URLSearchParams(data).toString()
      // return data
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransform[]),
    (function(data) {
      if(typeof data === 'object') {
        data.test = 2
      }
      return data
    })
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res => {
  console.log(res.data)
})
