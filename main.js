import Vue from 'vue'
import App from './App'
import store from './store'
import {checkPayPass} from '@/common/global'
Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.checkPayPass=checkPayPass;
App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
