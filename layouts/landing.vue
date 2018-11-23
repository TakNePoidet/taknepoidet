<template>
	<div>
		<app-header-logo/>
		<nuxt/>
		<app-footer/>
	</div>
</template>
<script>
import {mapActions}  from 'vuex';
import AppHeaderLogo from '~/components/HeaderLogo.vue'
import AppFooter from '~/components/AppFooter.vue'

export default {
	created() {

		
	},
	mounted() {
		if (process.browser) {
			// this.setLocale(localStorage.getItem('lang'));
		}
	},
	methods: {
		...mapActions(['setLocale']),
	},
	components: {
		AppHeaderLogo,AppFooter
	}
}
</script>
