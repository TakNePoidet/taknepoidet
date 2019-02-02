<template>
	<main>
		<div class="section-news-page">
			<article class="news-single-page">
				<div class="news-single-page__content">
					<p v-html="formatedText"/>
				</div>
				<div ref="gallery" class="news-single-page__gallery">
					<img
						v-for="(photo, key) in photos"
						:key="key"
						:src="$store.state.storage + '/images/news/' + photo.standart.src"
						:width="`${photo.standart.width}px`"
						:height="`${photo.standart.height}px`"
						@click="InstallImageViewer($store.state.storage + '/images/news/' + photo.original.src)"
					>
				</div>

				<i>{{ $store.state.lang.news.create }} {{ datePost }}</i>

				<div
					v-if="prev || next"
					:class="['news-single-page__other', ((prev && !next) ? 'news-single-page__not-next' : '')]"
				>
					<nuxt-link v-if="next" :to="`/news/${next.id}`" class="news-single-page__next">
						<img
							:src="$store.state.storage + '/images/news/' + next.cover.min.src"
							:srcset="$store.state.storage + '/images/news/' + next.cover.normal.src + ' 2x'"
						>
						<div>
							<i class="fas fa-arrow-left"/>
							{{ $store.state.lang.news.prev }}
						</div>
					</nuxt-link>
					<nuxt-link v-if="prev" :to="`/news/${prev.id}`" class="news-single-page__prev">
						<div>
							{{ $store.state.lang.news.next }}
							<i class="fas fa-arrow-right"/>
						</div>
						<img
							:src="$store.state.storage + '/images/news/' + prev.cover.min.src"
							:srcset="$store.state.storage + '/images/news/' + prev.cover.normal.src + ' 2x'"
							:width="`${prev.cover.min.width}px`"
							:height="`${prev.cover.min.height}px`"
						>
					</nuxt-link>
				</div>
			</article>
		</div>
	</main>
</template>

<script>
// import SwipeSlider from '~/plugins/SwipeSlider.js'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
	scrollToTop: true,
	validate({ params }) {
		return !isNaN(+params.id)
	},
	components: {},
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

	async asyncData({ params, store, redirect }) {
		try {
			let id = params.id

			let { data } = await axios.get(
				`${store.state.api}methods/news/${id}`
			)

			if (!data.response.length < 1) {
				redirect(404)
			}

			return {
				next: false,
				prev: false,
				...data.response
			}
		} catch (error) {
			console.log(error)
		}
	},
	data() {
		return {
			title: '',
			imageViewer: null,
			next: false,
			prev: false
		}
	},

	computed: {
		formatedText() {
			return this.formatedTextFilter(this.content)
		},

		datePost() {
			let date = new Date(this.created_at * 1000)

			return (
				date.getDate() +
				'.' +
				('0' + (date.getMonth() + 1)).slice(-2) +
				'.' +
				date.getFullYear()
			)
		}
	},

	created() {
		this.title = `${this.$store.state.lang.news.create} ${this.datePost}`
	},
	methods: {
		formatedTextFilter: function(value) {
			if (!value) return ''

			if (value.length > 100) {
				value = value.replace('\n', '<br>')
				let regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm
				value = value.replace(regex, (...matches) => {
					return `<a target="_blank" href="//vk.com/${matches[1]}">${
						matches[3]
					}</a>`
				})
			}

			return value
		},

		InstallImageViewer(link) {
			let ImageViewer = new window.ImageViewer()
			ImageViewer.show(link)
		}
	}
}
</script>
