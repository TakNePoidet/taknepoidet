<template>
	<div>
		<app-header ref="header"/>
		<nuxt/>
		<app-footer/>
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import AppHeader from "~/components/HeaderMainPage.vue";
import AppFooter from "~/components/AppFooter.vue";

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
		};
	},
	computed: {
		...mapGetters(["getThemes"]),
		classList() {
			const list = [`themes-${this.getThemes}`];
			return list.join(" ");
		}
	},
	mounted() {
		if (process.browser) {
			// this.setLocale(localStorage.getItem('lang'));
		}
	},
	mounted() {
		this.$store.commit("setHeader", this.$refs.header);
	},
	methods: {
		...mapActions(["setLocale", "init"])
	}
};
</script>
