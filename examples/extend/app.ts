import axios from '../../src/index'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi post'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hi axios 2 params'
  }
}).then(res => {
  console.log(res)
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi request post'
  }
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post' })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' })


interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err))
}

async function test() {
  const user = await getUser<User>()
  if(user) {
    console.log(user)
    console.log(user.result.name)
  }
}

test()
