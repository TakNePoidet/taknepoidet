<template>
	<header :class="[open ? 'open' : '', fixed ? 'fixed' : '']" class="header-main-page">
		<div class="header-main-page__wrap">
			<div class="header-main-page__logo">
				<nuxt-link to="/">
					<app-logo/>
				</nuxt-link>
			</div>
			<div class="header-main-page__bars" @click="open = !open">
				<i class="fas fa-bars" />
			</div>
		</div>
		<nav class="mainnav">
			<ul>
				<li><a v-scroll-to="'#home'" href="#home" @click="open = false">{{ $store.state.lang.header.home }}</a></li>
				<li><a v-scroll-to="'#about'" href="#about" @click="open = false">{{ $store.state.lang.header.about_me }}</a></li>
				<li><a v-scroll-to="'#news'" href="#news" @click="open = false">{{ $store.state.lang.header.records }}</a></li>
				<li><a v-scroll-to="'#social'" href="#social" @click="open = false">{{ $store.state.lang.header.contacts }}</a></li>
				<li><a v-scroll-to="'#landing-list'" href="#landing-list" @click="open = false">{{ $store.state.lang.header.landing_list }}</a></li>
				<li><a v-scroll-to="'#project'" href="#project" @click="open = false">{{ $store.state.lang.header.projects }}</a></li>
			</ul>
		</nav>
	</header>
</template>
<script>
import { mapState } from 'vuex'
import AppLogo from '~/components/AppLogo.vue'
export default {
	components: {
		AppLogo
	},
	data() {
		return {
			open: false,
			fixed: false
		}
	},

	computed: mapState(['baseurl']),

	methods: {
		scrollTo(anchor, event) {
			event.preventDefault()
			let box = this.$root.$el.querySelector(`[data-anchor="${anchor}"]`)

			if (box) {
				box.scrollIntoView()
			}
		}
	}
}
</script>
