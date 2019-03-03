<template>
	<main>
		<div id="home" ref="section-background-images" class="section-background-images jarallax">
			<img class="jarallax-img" src="/images/cover.jpg" alt>
			<div class="section-background-images__content">
				<app-logo/>
			</div>
			<svg x="0px" y="0px" viewBox="0 0 1501 78" class="section-background-images__bottom">
				<path d="M0,78,296.48,9.221l829.27,61.094L1501,0V78Z"/>
			</svg>
		</div>
		<div id="about" class="section-about">
			<h2 class="section-title">{{ $store.state.lang.header.about_me }}</h2>
			<div>
				<p v-html="$store.state.lang.section.about.text"/>
			</div>
		</div>

		<div id="social" class="section-social-networks social_networks">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1501 32.167"
				class="section-social-networks__top"
			>
				<path
					d="M835,117.166c-330.106,0-615.469-7.71-751-18.9V85H1585V98.348C1449.065,109.494,1164.29,117.166,835,117.166Z"
					transform="translate(-84 -85)"
				/>
			</svg>
			<h2 class="section-title">{{ $store.state.lang.section.social.title }}</h2>
			<ul class="social_networks__links">
				<li
					v-for="(item, key) in social_networks"
					:key="item.key"
					:class="['wow', ((key & 1) ? 'bounceInUp' : 'bounceInDown'),'social_networks__item', 'social_networks__item--' + item.key]"
					:data-wow-delay="key / 10 + 's'"
				>
					<a :href="item.link" target="_blank">
						<div class="social_networks__item__logo">
							<i :class="item.icon"/>
						</div>
						<div class="social_networks__item__nik">{{ item.nik }}</div>
						<div class="social_networks__item__name">{{ item.name }}</div>
					</a>
				</li>
			</ul>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1501 32.167"
				class="section-social-networks__bottom"
			>
				<path
					d="M835,85c-330.107,0-615.469,7.71-751,18.9v13.266H1585V103.818C1449.065,92.672,1164.29,85,835,85Z"
					transform="translate(-84 -85)"
				/>
			</svg>
		</div>
		<div id="news" class="section-news">
			<h2 class="section-title">{{ $store.state.lang.section.news.title }}</h2>
			<div v-if="news.length > 1" ref="news" class="news-container news-container--grid">
				<news-min v-for="item in news" :key="item.id" :data="item" :animation="true"/>
			</div>
			<nuxt-link
				v-if="news.length > 1"
				to="/news"
				target="blank"
				class="news-all-list"
			>{{ $store.state.lang.section.landing_list.more }}</nuxt-link>
			<div v-if="news.length < 1" class="news__none"/>
		</div>

		<div id="landing-list" class="section-landing">
			<svg
				class="section-landing-svg-top"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1501 52.166"
			>
				<path d="M106.969,52.418h0V.253h1501l-1501,52.165Z" transform="translate(-106.969 -0.253)"/>
			</svg>
			<h2 class="section-title">{{ $store.state.lang.section.landing_list.title }}</h2>

			<div class="landing-crop">
				<div class="landing-crop__wrap">
					<div v-for="(item) in rand_landing()" :key="item.key" class="landing-crop-item wow zoomIn">
						<a :href="item.link" target="_blank" rel="nofollow">
							<div class="landing-crop-item__images">
								<img
									:src="`${$store.state.storage}/images/landing/crop/${item.filename}@1x.jpg`"
									:alt="item.title[getLocale]"
									:srcset="`${$store.state.storage}/images/landing/crop/${item.filename}@2x.jpg 2x`"
								>
							</div>
							<div class="landing-crop-item__title">{{ item.title[getLocale] }}</div>
						</a>
					</div>
				</div>

				<a
					href="/landing"
					target="blank"
					class="landing-crop-all"
				>{{ $store.state.lang.section.landing_list.more }}</a>
			</div>
			<svg
				class="section-landing-svg-bottom"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1501 52.166"
			>
				<path
					d="M106.969,52.418h0V.253h1501l-1501,52.165Z"
					transform="translate(1607.969 52.418) rotate(180)"
				/>
			</svg>
		</div>
		<div id="project" class="project">
			<h2 class="section-title">{{ $store.state.lang.section.project.title }}</h2>
			<div class="project__wrap">
				<project-item
					v-for="(item, key) of project"
					:key="item.link"
					:index="key + 1"
					:data="item"
					:animation="true"
				/>
			</div>
			<nuxt-link
				to="/project"
				class="project-all-list"
			>{{ $store.state.lang.section.landing_list.more }}</nuxt-link>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1501.37 30.818">
				<g transform="translate(5277.37 6670)">
					<path d="M0,30.64H0V0H1501L0,30.64Z" transform="translate(-3776 -6639.36) rotate(180)"/>
					<path
						d="M106.969.253h0V30.906H1608.339L106.969.253Z"
						transform="translate(-5384.339 -6670.087)"
					/>
				</g>
			</svg>
		</div>
	</main>
</template>

<script>
// import SwipeSlider from '~/plugins/SwipeSlider.js'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import NewsMin from '~/components/news-min.vue'
import AppLogo from '~/components/AppLogo.vue'
import ProjectItem from '~/components/ProjectItem.vue'
export default {
	components: {
		NewsMin,
		AppLogo,
		ProjectItem
	},
	head() {
		return {
			title: this.title,
			meta: [
				{
					name: 'viewport',
					content:
						'width=device-width, initial-scale=1, shrink-to-fit=no'
				},
				{
					hid: 'description',
					name: 'description',
					content: this.description
				}
			]
		}
	},
	layout: 'main',
	async asyncData({ params, store }) {
		let { data } = await axios.get(`${store.state.api}methods/all`)
		let news = data.news
		let social_networks = data.social_networks
		let landing = data.landing
		let project = data.project
			.sort((a, b) => Math.random() - 0.5)
			.slice(0, 4)

		let title = store.state.lang.page.index.title
		let description = store.state.lang.page.index.description

		return {
			news,
			social_networks,
			project,
			landing,
			title,
			description
		}
	},
	data() {
		return {
			news: [],
			social_networks: [],
			project: [],
			landing: [],
			description: '',
			title: ''
		}
	},
	computed: {
		...mapGetters(['getHeader', 'getLocale'])
	},

	mounted() {
		if (process.browser && navigator.appVersion.indexOf('MSIE 10') === -1) {
			import('jarallax').then(Response => {
				let jarallax = Response.default.jarallax
				jarallax(this.$refs['section-background-images'], {
					speed: 0
				})
			})

			// let SwipeSlider = require('~/plugins/SwipeSlider.js')
			// console.log(SwipeSlider())
			// import('~/plugins/SwipeSlider.js').then(Response => {
			// 	// let SwipeSlider = Response.default.SwipeSlider
			// 	console.log(Response)
			// })
			// let news_block = this.$refs['news']
			// let news_block_items = Array.from(
			// 	news_block.querySelectorAll('.news__item')
			// )
		}
	},
	created() {
		if (process.browser) {
			window.addEventListener('scroll', this.windowScroll)
		}
	},
	beforeDestroy() {
		if (process.browser) {
			window.removeEventListener('scroll', this.windowScroll)
		}
	},

	methods: {
		windowScroll() {
			let box = this.$refs['section-background-images']
			let { height } = box.getBoundingClientRect()
			let scrollTop = window.pageYOffset

			box.querySelector(
				'.section-background-images__content'
			).style.opacity = scrollTop === 0 ? 1 : 1 / ((scrollTop / 100) * 4)

			if (scrollTop > height - 90 * 2) {
				this.getHeader.fixed = true
			} else {
				this.getHeader.fixed = false
				this.getHeader.open = false
			}
		},

		rand_landing() {
			if (process.browser) {
				let landing = this.landing.slice()

				landing = landing.filter(el => {
					return el.top === true
				})

				let rand_landing = landing.sort(function(a, b) {
					return Math.random() - 0.5
				})
				return rand_landing.slice(0, 6)
			}
		}
	}
}
</script>
