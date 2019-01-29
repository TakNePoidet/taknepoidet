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
			}
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
	methods: {
		...mapActions(['setLocale'])
	}
}
</script>
