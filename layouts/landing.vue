<template>
	<div>
		<app-header/>
		<nuxt/>
		<app-footer/>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '~/components/Header.vue'
import AppFooter from '~/components/AppFooter.vue'

export default {
	components: {
		AppHeader,
		AppFooter
	},
	head() {
		return {
			htmlAttrs: {
				class: this.classList
			},
			meta: [
				{
					hid: 'viewport',
					name: 'viewport',
					content: 'width=1200,user-scalable=yes'
				},
				{
					hid: 'og:image',
					name: 'og:image',
					content: '/images/cover-site-landing.jpg'
				},
				{
					hid: 'og:image:url',
					name: 'og:image:url',
					content: '/images/cover-site-landing.jpg'
				},
				{
					hid: 'og:image:secure_url',
					name: 'og:image:secure_url',
					content: '/images/cover-site-landing.jpg'
				},
				{
					hid: 'og:image:width',
					name: 'og:image:width',
					content: 1200
				},
				{
					hid: 'og:image:height',
					name: 'og:image:height',
					content: 600
				},
				{
					hid: 'author',
					name: 'author',
					content: this.$store.state.lang.page.standart.author
				},
				{
					hid: 'article:author',
					name: 'article:author',
					content: this.$store.state.baseurl
				},
				{
					hid: 'og:url',
					name: 'og:url',
					content: this.$store.state.baseurl + 'landing/'
				}
			],
			link: [
				{
					hid: 'image_src',
					rel: 'image_src',
					href: '/images/cover-site-landing.jpg'
				}
			]
		}
	},
	computed: {
		...mapGetters(['getThemes']),
		classList() {
			let list = [`themes-${this.getThemes}`]
			return list.join(' ')
		}
	},
	mounted() {
		if (process.browser) {
			// this.setLocale(localStorage.getItem('lang'));
		}
	},
	mounted() {
		if (process.browser) {
			// this.setLocale(localStorage.getItem('lang'));
		}
	},
	methods: {
		...mapActions(['setLocale'])
	}
}
</script>
