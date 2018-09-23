module.exports = {
	/*
	** Headers of the page
	*/
	head: {
	title: 'Якин Никита',
	meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
		{ hid: 'description', name: 'description', content: 'Моя личная страница. Зачем?! Потому что я так хочу. ¯\_(ツ)_/¯' },

		{ name: 'og:image', 	content: '/images/cover_site.png' },
		{ name: 'og:image:url', content: '/images/cover_site.png¯' },
		{ name: 'og:image:secure_url', content: '/images/cover_site.png' },

		{ name: 'theme-color', 	content: '#262E58' },
		{ name: 'og:type', 		content: 'page' },
		{ name: 'og:url', 		content: 'https://taknepoidet.ru' },
		{ name: 'google-site-verification', content: 'oKl2A6Zsi1pzXSzbqnbPSZi9j6cGTP-SVetE67RCd44' },

	],
		link: [
			{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }
		]
	},
	/*
	** Customize the progress bar color
	*/
	loading: { color: '#3B8070' },
	/*
	** Build configuration
	*/
	css: [
		'~assets/css/style.scss'
	],
	plugins: [
		'~plugins/taknepoidet'
	],
	cache: true,
	modules: [
		[
		'@nuxtjs/yandex-metrika',
			{
			id: '39689345',
			webvisor: true,
			// clickmap:true,
			// useCDN:false,
			// trackLinks:true,
			// accurateTrackBounce:true,
			}
		],
	],
	build: {
		/*
		** Run ESLint on save
		*/
		extractCSS : true,
		vendor: ['axios'],
		filenames: {
			css: 'common.[contenthash].css',
			manifest: 'manifest.[hash].js',
			vendor: 'common.[chunkhash].js',
			app: 'app.[chunkhash].js',
			chunk: '[name].[chunkhash].js'
		},
		extend (config, { isDev, isClient }) {

			if (isClient) {
				config.devtool = '#source-map'
			}
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
		}
	}
}

