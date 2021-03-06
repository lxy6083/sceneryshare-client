import Vue from 'vue'
import Vuex from 'vuex'
import configure from './configure'
import share from './share'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    configure,
    user,
    share
  }
})
