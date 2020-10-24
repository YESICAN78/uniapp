import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import {request} from "./Utils/request.js"
import {MRequest} from "api/index.js"
import {Uploade} from "./Utils/Uploade.js"
//判断用户是否登录
import {iflogin} from "./Utils/Iflogin.js"
Vue.prototype.$request = request;
Vue.prototype.$request1 = MRequest;
Vue.prototype.$Uploade = Uploade;
Vue.prototype.$iflogin = iflogin;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
		store
})
app.$mount()
