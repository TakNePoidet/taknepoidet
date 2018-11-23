<template>
	<div>
		<app-header ref="header"></app-header>
		<nuxt/>
		<app-footer/>
	</div>
</template>
<script>
import {mapActions}  from 'vuex';
import AppHeader from '~/components/Header.vue'
import AppFooter from '~/components/AppFooter.vue'
export default {
	created() {
		// this.init();
		// this.setLocale('ru');
		
	},
	mounted() {
		this.$store.commit('setHeader', this.$refs.header);
		if (process.browser) {
			// this.setLocale(localStorage.getItem('lang'));
		}
	},
	methods: {
		...mapActions(['setLocale','init']),
	},
	components: {
		AppHeader,AppFooter
	}
}
</script>
