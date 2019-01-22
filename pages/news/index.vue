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
