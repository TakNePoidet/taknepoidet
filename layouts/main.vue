<template>
	<div>
		<app-header ref="header"/>
		<nuxt/>
		<app-footer/>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import AppHeader from '~/components/HeaderMainPage.vue'
import AppFooter from '~/components/AppFooter.vue'
export default {
	components: {
		AppHeader,
		AppFooter
	},
	mounted() {
		this.$store.commit('setHeader', this.$refs.header)
	},
	methods: {
		...mapActions(['setLocale', 'init'])
	}
}
</script>
