
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)


const state = {
	baseurl : `https://taknepoidet.ru/`,
	api 	: `https://api.taknepoidet.ru/`,
	lang	: {},
	locale: null,
	social_networks: [
		{   
			key  : 'vk',
			icon : 'fab fa-vk',
			link : 'https://vk.com/taknepoidet',
			nik  : '@taknepoidet',
			name : 'VK',
		},{
			key  : 'whatsapp',
			icon : 'fab fa-whatsapp',
			link : 'https://api.whatsapp.com/send?phone=+79177747838?text=%20%D0%94%D0%9E%D0%A0%D0%9E%D0%A3%20%C2%AF_(%E3%83%84)_/%C2%AF',
			nik  : '8 (917) 77-47-838',
			name : 'WhatsApp',
		},{   
			key  : 'instagram',
			icon : 'fab fa-instagram',
			link : 'https://www.instagram.com/tak_ne_poidet/',
			nik  : '@tak_ne_poidet',
			name : 'Instagram',
		},{   
			key  : 'facebook',
			icon : 'fab fa-facebook-f',
			link : 'https://www.facebook.com/TakNePoidet',
			nik  : 'TakNePoidet',
			name : 'Facebook',
		},{   
			key  : 'google',
			icon : 'far fa-envelope-open',
			link : 'mailto:yakin95@gmail.com',
			nik  : 'yakin95@gmail.com',
			name : 'Email',
		},{   
			key  : 'telegram',
			icon : 'fab fa-telegram-plane',
			link : 'https://t.me/TakNePoidet',
			nik  : '@taknepoidet',
			name : 'Telegram',
		},{   
			key  : 'github',
			icon : 'fab fa-github',
			link : 'https://github.com/TakNePoidet',
			nik  : 'TakNePoidet',
			name : 'GitHub',
		},{   
			key  : 'icq',
			icon : 'fas fa-comment',
			link : 'https://icq.com/385833740',
			nik  : '385 833 740',
			name : 'ICQ',
		}
	],
	header : null,
	project : [
		{
			link : 'http://slider.dev.taknepoidet.ru/',
			images : 'FireShot_1.png',
			title : {
				'ru' : 'Слайдер на чистом sass',
				'en' : 'A pure css slider',
			}

		},{
			link : 'https://emojipw.org/',
			images : 'FireShot_2.png',
			title : {
				'ru' : 'Генератор паролей из emoji',
				'en' : 'Password generator from emoji',
			}

		},{
			link : 'https://vk.com/messagerecognition',
			images : 'FireShot_3.png',
			title : {
				'ru' : 'Распознавание голосовых сообщений',
				'en' : 'Voice recognition',
			}

		}
	]
}

const getters = {
	getLocale : state => state.locale,
	getLocaleText : state => val => { 
		let arr = state.lang;
		for  (let i of val.split('.')) {
			arr = arr[i]
			if (typeof arr === 'undefined') {
				break
			}
		}
		return arr;
	},
	getSocialNetworks : state => state.social_networks,
	getHeader : state => state.header,
	getProject : state => state.project,
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
}

const actions  = {
	async nuxtServerInit({ state, commit }, { isDev, env, req, redirect }) {
		console.log(env);
	},
	setLocale({state, commit},lang) {
		commit('setLocale', lang);
		const locate = require('./locate/' + state.locale);
		commit('setLang', locate);
	},

	async getNewsApi(context) {

		let {state} = context;
		try {
			let { data } = await axios.get(`${state.api}news.json`);
			return data;

		} catch (error) {
			console.log(error)
		}
	}
}

const store = () => new Vuex.Store({
	state,
	mutations,
	actions,
	getters
});

export default store

// b = a;
// for  (let i of 'sec.a'.split('.')) {
//     b = b[i]
// }

// console.log(b)