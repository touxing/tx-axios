import { AxiosTransformer } from './../../src/types/index'
import axios from '../../src/index'

axios.defaults.headers.common['test-token'] = 'testtoken' + Date.now()

let data = new URLSearchParams({
  age: 18,
  name: 'Lili'
}).toString()

console.log(data)

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: data,
//   headers: {
//     test: 'test-head'
//   }
// }).then(res => {
//   console.log(res.data)
// })

URLSearchParams.prototype.toJSON = function() {
  let result = {}
  for (let [key, value] of this.entries()) {
    result[key] = value
  }
  return result
}
URLSearchParams.prototype.toStringify = function() {
  let result

  try {
    result = JSON.stringify(this.toJSON())
  } catch (error) {
    throw new Error(error)
  }
  return result
}

const instance = axios.create({
  transformRequest: [
    function(data) {
      console.log(data)
      // return new URLSearchParams(data).toString()
      return data
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransform[]),
    function(data) {
      if (typeof data === 'object') {
        data.test = 2
      }
      return data
    }
  ]
})

// instance
//   .post('/config/post', {
//     a: 2,
//     person: {
//       name: 'Wang',
//       gender: 'female'
//     }
//   })
//   .then(res => {
//     console.log(res.data)
//   })

instance
  .post(
    '/config/post',
    {
      name: 'Hzan',
      age: 22
    },
    {
      headers: {
        postTest: 'postTest'
      }
    }
  )
  .then(res => {
    console.log(res.data)
  })

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    testToken: 'testToken'
  }
}).then(res => {
  console.log(res.data)
})
