// 引入aixos
import axios from 'axios'
// 定义一个插件对象
let myPlugs = {}
myPlugs.install = function (Vue) {
  // 设置统一的请求地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 设置统一的请求头路径
  axios.interceptors.request.use(function (config) {
    if (config.url !== 'login') {
      config.headers.Authorization = window.localStorage.getItem('token')
    }
    return config
  })

  // 挂出来
  Vue.prototype.$http = axios
}
export default myPlugs
