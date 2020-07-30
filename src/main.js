import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/styles/custom.scss'
import VoerroTagsInput from '@voerro/vue-tagsinput'
import _ from 'lodash'
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'

Vue.component('tags-input', VoerroTagsInput);

const axios = require('axios').default;

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueCroppie)

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.$api = (process.env.NODE_ENV === 'development') ? "http://127.0.0.1:5000/v1" : "https://api.matchame.co.za/v1"

let stateOld = localStorage.getItem("firewood")

let socketUri = (process.env.NODE_ENV === 'development') ? "ws://127.0.0.1:5000/ws" : "wss://api.matchame.co.za/ws"


if (stateOld) {
  Vue.prototype.$store = Vue.observable(JSON.parse(stateOld))
  //Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + Vue.prototype.$store.token
  // Vue.prototype.$socket.socket.onopen = () => {
  //   Vue.prototype.$socket.authenticate(Vue.prototype.$store.token)
  // }
} else {
  Vue.prototype.$store = Vue.observable({ 
    token: false,
    user: false,
  })
}

import {actions, socket} from './store'

socket.connect(socketUri)

actions.init(Vue.prototype.$api)
  .then(() => {
    let vue = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
    actions.setVue(vue)
  })