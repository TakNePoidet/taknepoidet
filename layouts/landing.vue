<template>
	<div>
		<app-header/>
		<nuxt/>
		<app-footer/>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import AppHeader from '~/components/Header.vue'
import AppFooter from '~/components/AppFooter.vue'

export default {
	components: {
		AppHeader,
		AppFooter
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
