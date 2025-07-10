import Vue from 'vue'
import Vuex from 'vuex'
//BOC
import account from "./modules/account";
//EOC

Vue.use(Vuex)
const debug = process.env.VUE_APP_ENV !== 'production'

//BOC:[persist]
import VuexPersistence from 'vuex-persist'
import Cookies from 'js-cookie'
const vuexCookie = new VuexPersistence({
	key:"cookieStore",
	restoreState: (key) => Cookies.get(key),
	saveState: (key, state) =>
		Cookies.set(key, state, {
			expires: 30, // expire in 30 days
		}),
	modules:[
		//
	],
});
const vuexLocal = new VuexPersistence({
	key:"localStore",
	storage: window.localStorage,
	modules:[
    "account",
	],
})
//EOC

export default new Vuex.Store({
	modules: {
    account:account,
	},
	strict: debug,
	plugins: [
		vuexCookie.plugin, 
		vuexLocal.plugin,
	],
})
