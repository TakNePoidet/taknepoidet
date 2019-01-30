const pkg = require('./package')

const scrollBehavior = function(to, from, savedPosition) {
	let position = false

	if (to.matched.length < 2) {
		position = { x: 0, y: 0 }
	} else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
		position = { x: 0, y: 0 }
	}

	if (savedPosition) {
		position = savedPosition
	}

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
				name: 'viewport',
				content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
			},
			{
				hid: 'description',
				name: 'description',
				content:
					'Моя личная страница. Зачем?! Потому что я так хочу. ¯_(ツ)_/¯'
			},

			{ name: 'og:image', content: '/images/cover_site.png' },
			{ name: 'og:image:url', content: '/images/cover_site.png¯' },
			{ name: 'og:image:secure_url', content: '/images/cover_site.png' },

			{ name: 'theme-color', content: '#262E58' },
			{ name: 'og:type', content: 'page' },
			{ name: 'og:url', content: 'https://taknepoidet.ru' },
			{
				name: 'google-site-verification',
				content: 'oKl2A6Zsi1pzXSzbqnbPSZi9j6cGTP-SVetE67RCd44'
			}
		],

		link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }]
		// script: [{ src: 'https://yastatic.net/browser-updater/v1/script.js' }]
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
		[
			'@nuxtjs/axios',
			'@babel/polyfill',
			'@nuxtjs/yandex-metrika',
			{
				id: '39689345',
				webvisor: true,
				clickmap: true
				// useCDN:false,
				// trackLinks:true,
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
	}
}
