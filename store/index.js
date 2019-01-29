import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const state = {
	baseurl: `https://taknepoidet.ru/`,
	api: `https://api.taknepoidet.ru/`,
	storage: `https://storage.taknepoidet.ru`,
	lang: {},
	locale: null,
	language: ['en', 'ru'],
	header: null,
	social_networks: [],
	project: [],
	landing: [],
	theme: 'light'
}

const getters = {
	getLocale: state => state.locale,
	getThemes: state => state.theme,
	getLocaleText: state => val => {
		let arr = state.lang
		for (let i of val.split('.')) {
			arr = arr[i]
			if (typeof arr === 'undefined') {
				break
			}
		}
		return arr
	},

	getLanguageList: state => state.language,
	getSocialNetworks: state => state.social_networks,
	getHeader: state => state.header,
	getProject: state => state.project,
	getLanding: state => state.landing
}

const mutations = {
	setLocale(state, locale) {
		state.locale = locale
	},
	setLang(state, lang) {
		state.lang = lang
	},
	setHeader(state, header) {
		state.header = header
	},
	setThemes(state, theme) {
		state.theme = theme
	}
}

const actions = {
	async nuxtServerInit({ state, commit }, { isDev, env, req, redirect }) {},
	async setLocale({ state, commit }, lang) {
		// if (state.locale === lang) return true;

		let locate
		commit('setLocale', lang)
		try {
			let { data } = await axios.get(`${state.api}methods/locate/${lang}`)
			locate = data.lang
			lang = data.locate
		} catch (error) {
			console.log(1)
		}

		commit('setLang', locate)
		let cookies
		if (process.browser) {
			cookies = this.$cookiz
		} else {
			cookies = this.$cookiz
		}

		if (
			typeof this.$cookiz.get('locale') !== 'undefined' &&
			this.$cookiz.get('locale') !== lang
		) {
			cookies.set('locale', lang, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7
			})
		}
	},

	setThemes({ state, commit }, theme) {
		commit('setThemes', theme)
		let cookies
		if (process.browser) {
			cookies = this.$cookiz
		} else {
			cookies = this.$cookiz
		}

		if (
			this.$cookiz.get('theme') !== theme
		) {
			cookies.set('theme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7
			})
		}
	},

	async getNewsApi(context) {
		let { state } = context
		try {
			let { data } = await axios.get(`${state.api}methods/news`)
			return data
		} catch (error) {
			console.log(error)
		}
	}
}

const store = () =>
	new Vuex.Store({
		state,
		mutations,
		actions,
		getters
	})

export default store

// b = a;
// for  (let i of 'sec.a'.split('.')) {
//     b = b[i]
// }

// console.log(b)
