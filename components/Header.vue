<template>
	<header :class="[open ? 'open' : '', fixed ? 'fixed' : '', show ? 'show' : 'hide']" class="header">
		<div class="header__wrap">
			<nuxt-link :to="backLink" class="header__prew" @click="open = !open">
				<i class="fas fa-arrow-left"/>
			</nuxt-link>

			<div class="header__logo">
				<nuxt-link to="/" @click="open = !open">
					<app-logo/>
				</nuxt-link>
			</div>
			<div class="header__bars" @click="open = !open">
				<i class="fas fa-bars"/>
			</div>
		</div>
		<nav class="mainnav">
			<ul ref="mainnav" :class="{scroll: scrollMainnav}">
				<li v-for="link in linksFilter" :key="link.key">
					<nuxt-link v-if="!link.new_window" :to="link.path" @click="close">{{ link.title }}</nuxt-link>
					<a v-else :href="link.path" target="_blank" @click="close">{{ link.title }}</a>
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
			show: false,
			transition: false,
			scroll: 0,
			scrollMainnav: false,
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
					path: '/project'
				}
			]
		}
	},

	computed: {
		...mapState(['baseurl']),

		backLink() {
			this.close()
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
			this.resetHeader()
			return link
		},

		linksFilter() {
			return this.links.filter(item => {
				return item.key !== this.currentPath
			})
		}
	},
	watch: {
		open() {
			this.$nextTick(function() {
				this.isScrollMainnav()
			})
		}
	},
	mounted() {
		if (process.browser) {
			this.scroll = window.pageYOffset
			window.addEventListener('scroll', this.windowScroll)
			window.addEventListener('resize', this.windowResize)
			this.$refs['mainnav'].addEventListener(
				'mousewheel',
				this.onScrollMainNav
			)

			this.onScrollMainNav()
		}
	},
	beforeDestroy() {
		if (process.browser) {
			window.removeEventListener('scroll', this.windowScroll)
			window.removeEventListener('resize', this.windowResize)
			this.$refs['mainnav'].removeEventListener(
				'mousewheel',
				this.onScrollMainNav
			)
		}
	},
	methods: {
		close() {
			this.open = false
		},

		windowScroll() {
			this.open = false
			if (window.pageYOffset > 90) {
				this.fixed = true
				document.body.classList.add('header-fixed')
			} else {
				if (window.pageYOffset == 0) {
					this.fixed = false
					this.show = false
					document.body.classList.remove('header-fixed')
				}
			}
			if (Math.abs(window.pageYOffset - this.scroll) > 100) {
				if (this.scroll > window.pageYOffset) {
					this.show = true
					this.transition = true
				}
				if (this.scroll < window.pageYOffset) {
					this.show = false
				}
				this.scroll = window.pageYOffset
			}
		},
		onScrollMainNav(e) {
			if (e) {
				e.preventDefault()
				let evt = e.originalEvent
				let position = this.$refs['mainnav'].scrollLeft
				position += e.deltaY < 0 ? -120 : 120
				this.$refs['mainnav'].scrollLeft = position
			}
		},
		isScrollMainnav() {
			let ul = this.$refs['mainnav']
			if (ul.scrollWidth - ul.clientWidth > 0) {
				this.scrollMainnav = true
			} else {
				this.scrollMainnav = false
			}
		},
		windowResize() {
			this.isScrollMainnav()
		},
		resetHeader() {
			this.open = false
			this.fixed = false
			this.show = false
		}
	}
}
</script>
