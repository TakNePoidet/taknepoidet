<template>
	<div>
		<app-header ref="header"></app-header>
		<nuxt/>
		<footer class="footer" id="footer">
			<b>TakNePoidet <i class="far fa-copyright"></i> 
			{{new Date().getFullYear()}}</b><br>
			<small>By {{$store.state.lang.section.footer.name}}</small>
		</footer>
	</div>
</template>
<script>
import {mapActions}  from 'vuex';
import AppHeader from '~/components/Header.vue'
export default {
	created() {
		// this.init();
		this.setLocale('ru');
		
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
		AppHeader
	}
}
</script>
