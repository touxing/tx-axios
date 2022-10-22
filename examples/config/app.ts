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
