<template>
	<main>
		<div id="news" class="section-news">
			<h1 class="page-title">{{ $store.state.lang.section.news.title }}</h1>

			<nuxt-link v-if="page > 1" :to="'?page=' + (page - 1)">&lt; Prev</nuxt-link>
			<a v-else class="disabled">&lt; Prev</a>
			<span>{{ page }}/{{ totalPages }}</span>
			<nuxt-link v-if="page < totalPages" :to="'?page=' + (page + 1)">Next &gt;</nuxt-link>

			<div v-if="news.length > 1" ref="news" class="news-container-pages">
				<news-min v-for="item in news" :key="item.id" :data="item"/>
			</div>
			<div v-if="news.length < 1" class="news__none"/>
		</div>
	</main>
</template>

<script>
// import SwipeSlider from '~/plugins/SwipeSlider.js'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import NewsMin from '~/components/news-min.vue'

export default {
	watchQuery: ['page'],
	components: {
		NewsMin
	},
	layout: 'pages-standart',
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
					name: 'description'
					// content: this.description
				}
			],
			bodyAttrs: {
				class: 'body-pages-standart'
			}
		}
	},

	async asyncData({ query, params, store }) {
		try {
			let count = 21
			let page = +query.page || 1

			let offset = (page - 1) * count
			let { data } = await axios.get(
				`${
					store.state.api
				}methods/news/?count=${count}&offset=${offset}`
			)

			let totalPages = Math.round(data.response.count / count) + 1

			console.log({
				page,
				totalPages
			})
			return {
				page: page,
				totalPages: totalPages,
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
