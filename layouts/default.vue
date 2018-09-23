<template>
	<div>
		<nuxt/>
	</div>
</template>
<script>
import {mapActions}  from 'vuex';
import AppHeader from '~/components/Header.vue'
export default {
	created() {
		this.setLocale('en');
	},
	mounted() {
		this.$store.commit('setHeader', this.$refs.header);
	},
	methods: {
		...mapActions(['setLocale']),
	},
	components: {
		AppHeader
	}
}
</script>
