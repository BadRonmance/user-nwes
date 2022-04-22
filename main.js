import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import request from './libs/request'
import http from './libs/request/request.js'
import utils from './libs/utils'
Vue.prototype.$util = utils
Vue.prototype.$request = request
Vue.prototype.$http = http.http
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif