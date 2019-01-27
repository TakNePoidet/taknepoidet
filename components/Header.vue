<template>
	<header :class="[open ? 'open' : '', fixed ? 'fixed' : '']" class="header">
		<div class="header__wrap">
			<nuxt-link :to="backLink" class="header__prew">
				<i class="fas fa-arrow-left"/>
			</nuxt-link>

			<div class="header__logo">
				<nuxt-link to="/">
					<app-logo/>
				</nuxt-link>
			</div>
			<div class="header__bars" @click="open = !open">
				<i class="fas fa-bars"/>
			</div>
		</div>
		<nav class="mainnav">
			<ul>
				<li v-for="link in linksFilter" :key="link.key">
					<nuxt-link v-if="!link.new_window" :to="link.path" @click="open = false">{{ link.title }}</nuxt-link>
					<a v-else :href="link.path" target="_blank" @click="open = false">{{ link.title }}</a>
				</li>
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
			fixed: false,

			links: [
				{
					key: 'about',
					title: this.$store.state.lang.header.about_me,
					path: '/#about'
				},
				{
					key: 'news',
					title: this.$store.state.lang.header.records,
					path: '/news'
				},
				{
					key: 'social',
					title: this.$store.state.lang.header.contacts,
					path: '/#social'
				},
				{
					key: 'landing',
					title: this.$store.state.lang.header.landing_list,
					path: '/landing',
					new_window: true
				},
				{
					key: 'project',
					title: this.$store.state.lang.header.projects,
					path: '/#project'
				}
			]
		}
	},

	computed: {
		...mapState(['baseurl']),

		backLink() {
			let path = this.$nuxt._route.path
				.split('/')
				.filter(el => el.length > 0)

			let link = path[path.length - 2]
			return typeof link !== 'undefined' ? '/' + link : '/'
		},
		currentPath() {
			let path = this.$nuxt._route.path
				.split('/')
				.filter(el => el.length > 0)

			let link = path[path.length - 1]
			if (typeof link === 'undefined') {
				link = 'home'
			}
			return link
		},

		linksFilter() {
			return this.links.filter(item => {
				return item.key !== this.currentPath
			})
		}
	}
}
</script>
