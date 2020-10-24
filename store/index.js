import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
	state:{
		goodslist: [],
	},
	getters:{
		
	},
	mutations:{
		goodslist(state, goods){
			state.goodslist.push(goods)
		}
	},
	actions:{
		
	},
	modules:{
		
	}
})