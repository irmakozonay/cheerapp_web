import Vue from 'vue'
import Vuex from 'vuex'
import feed from '@/components/feed/store'

Vue.use(Vuex)
Vue.use(require('vue-shortkey'))

export default new Vuex.Store({
  modules: {
    feed,
  }
})
