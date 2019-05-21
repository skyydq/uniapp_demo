import Vue from 'vue'
import Vuex from 'vuex'
import module_0 from './module_0'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules:{
        module_0:module_0
    }
})
export default store