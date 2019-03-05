<template>
	<main>
		<div id="news" class="section-news">
			<h1 class="page-title">{{ $store.state.lang.section.news.title }}</h1>
			<div v-if="news.length > 1" ref="news" class="news-container-pages">
				<news-min v-for="item in news" :key="item.id" :data="item"/>
			</div>
			<div v-if="news.length < 1" class="news__none"/>

			<paginate :current="page" :all="allCount" :count-page="21" parent-link="/news/"/>
		</div>
	</main>
</template>

<script>
// import SwipeSlider from '~/plugins/SwipeSlider.js'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import NewsMin from '~/components/news-min.vue'
import Paginate from '~/components/paginate.vue'
export default {
	watchQuery: ['page'],
	key: to => to.fullPath,
	// Called to know which transition to apply
	transition(to, from) {
		if (!from) return 'slide-left'
		return +to.query.page < +from.query.page ? 'slide-right' : 'slide-left'
	},
	components: {
		NewsMin,
		Paginate
	},
	layout: 'pages-standart',
	head() {
		return {
			title: this.title,
			meta: [
				{
					hid: 'og:title',
					name: 'og:title',
					content: this.title
				},
				{
					hid: 'description',
					name: 'description',
					content: this.$store.state.lang.page.index.description
				},
				{
					hid: 'og:description',
					name: 'og:description',
					content: this.$store.state.lang.page.index.description
				},
				{
					hid: 'og:image',
					name: 'og:image',
					content: '/images/cover-site-post.jpg'
				},
				{
					hid: 'og:image:url',
					name: 'og:image:url',
					content: '/images/cover-site-post.jpg'
				},
				{
					hid: 'og:image:secure_url',
					name: 'og:image:secure_url',
					content: '/images/cover-site-post.jpg'
				},
				{
					hid: 'og:url',
					name: 'og:url',
					content: this.$store.state.baseurl + 'news/'
				}
			],
			bodyAttrs: {
				class: 'body-pages-standart'
			},
			link: [
				{
					hid: 'image_src',
					rel: 'image_src',
					href: '/images/cover-site-news.jpg'
				},
				{
					hid: 'canonical',
					rel: 'canonical',
					href: this.$store.state.baseurl + 'news/'
				}
			]
		}
	},

	async asyncData({ query, params, store }) {
		try {
			let count = 21
			let page = +query.page || 1

			let offset = (page - 1) * count

			let { data } = await axios.get(
				`${store.state.api}methods/news?count=${count}&offset=${offset}`
			)

			let totalPages = Math.round(data.response.count / count) + 1
			return {
				page: page,
				allCount: parseInt(data.response.count),
				news: data.response.items,
				title: store.state.lang.section.news.title
				// description: store.state.lang.page.landing.description
			}
		} catch (error) {
			console.log(error)
		}
	},
	data() {
		return {
			landing: [],
			description: '',
			title: ''
		}
	}
}
</script>
