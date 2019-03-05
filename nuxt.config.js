const pkg = require('./package')
const axios = require('axios')

const scrollBehavior = function(to, from, savedPosition) {
	let position = false

	position = { x: 0, y: 0 }

	return new Promise(resolve => {
		window.$nuxt.$once('triggerScroll', () => {
			if (to.hash && document.querySelector(to.hash)) {
				position = { selector: to.hash }
			}
			resolve(position)
		})
	})
}

module.exports = {
	mode: 'universal',

	/*
	 ** Headers of the page
	 */
	head: {
		title: 'Якин Никита',
		meta: [
			{ charset: 'utf-8' },
			{
				hid: 'viewport',
				name: 'viewport',
				content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
			},
			{
				name: 'google-site-verification',
				content: 'oKl2A6Zsi1pzXSzbqnbPSZi9j6cGTP-SVetE67RCd44'
			},
			{ name: 'theme-color', content: '#262E58' }
		],

		link: [
			{
				hid: 'icon',
				rel: 'icon',
				type: 'image/png',
				href: '/images/favicon.png'
			},
			{
				hid: 'image_src',
				rel: 'image_src',
				href: '/images/cover-site.jpg'
			},
			{
				hid: 'canonical',
				rel: 'canonical',
				href: 'https://taknepoidet.ru'
			}
		]
	},

	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#262E58' },

	/*
	 ** Global CSS
	 */
	css: ['~assets/css/style.scss'],

	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		'~plugins/init',
		'~plugins/taknepoidet',
		{ src: '~/plugins/SwipeSlider', ssr: false },
		{ src: '~/plugins/Device', ssr: false },
		{ src: '~/plugins/imageViewer/index', ssr: false }
	],
	router: {
		scrollBehavior
	},

	cache: true,
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://github.com/nuxt-community/axios-module#usage
		'@nuxtjs/axios',
		// '@babel/polyfill',
		[
			'@nuxtjs/yandex-metrika',
			{
				id: '39689345',
				webvisor: true,
				clickmap: true,
				// useCDN:false,
				trackLinks: true
				// accurateTrackBounce:true,
			}
		],
		['cookie-universal-nuxt', { alias: 'cookiz' }]
	],
	/*
	 ** Axios module configuration
	 */
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
	},
	/*
	 ** Build configuration
	 */
	build: {
		extractCSS: true,
		postcss: [
			require('autoprefixer')({
				browsers: ['last 2 versions', 'ie 10-11', 'Firefox > 20']
			})
		],

		filenames: {
			app: ({ isDev }) => (isDev ? '[name].js' : '[chunkhash].js'),
			chunk: ({ isDev }) => (isDev ? '[name].js' : '[chunkhash].js'),
			css: ({ isDev }) => (isDev ? '[name].css' : '[contenthash].css'),
			img: ({ isDev }) =>
				isDev ? '[path][name].[ext]' : 'img/[hash:7].[ext]',
			font: ({ isDev }) =>
				isDev ? '[path][name].[ext]' : 'fonts/[hash:7].[ext]',
			video: ({ isDev }) =>
				isDev ? '[path][name].[ext]' : 'videos/[hash:7].[ext]'
		},
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			// Run ESLint on save
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push(
					{
						enforce: 'pre',
						test: /\.(js|vue)$/,
						loader: 'eslint-loader',
						exclude: /(node_modules)/
					},
					{
						test: /\.(js)$/,
						loader: 'babel-loader',
						exclude: /(node_modules)/
					}
				)
			}
		}
	},
	generate: {
		routes() {
			return axios
				.get('https://api.taknepoidet.ru/methods/news?count=1000')
				.then(res => {
					console.log(res.data.items)
					return res.data.response.items.map(news => {
						return '/news/' + news.id
					})
				})
		}
	}
}
