import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8083' //'http://207.154.246.55:8083' // 

export const eventBus = new Vue();

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

