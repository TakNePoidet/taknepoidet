<template>
	<main>
		<div class="section-news-page">
			<article class="news-single-page">
				<div class="news-single-page__content">
					<p v-for="(paragraph, keyp) in formatedText" :key="keyp" v-html="paragraph"/>
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

				<time :title="moment(created_at * 1000).utc().format()">
					<i>{{ dateFormatPost() }}</i>
				</time>

				<div
					v-if="prev || next"
					:class="['news-single-page__other', ((prev && !next) ? 'news-single-page__not-next' : '')]"
				>
					<nuxt-link v-if="next" :to="`/news/${next.slug}/`" class="news-single-page__next">
						<img
							:src="$store.state.storage + '/images/news/' + next.cover.min.src"
							:srcset="$store.state.storage + '/images/news/' + next.cover.normal.src + ' 2x'"
						>
						<div>
							<i class="fas fa-arrow-left"/>
							{{ $store.state.lang.news.prev }}
						</div>
					</nuxt-link>
					<nuxt-link v-if="prev" :to="`/news/${prev.slug}/`" class="news-single-page__prev">
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
import { formatedText, getNewsTitlePage } from '~/assets/js/util/news'
import slug from '~/assets/js/util/slug/index'
import moment from 'moment'
moment.locale()
export default {
	scrollToTop: true,
	validate({ params }) {
		let regex = /^([0-9]*)-([a-z0-9-]*)/gm
		return regex.exec(params.slug) !== null
	},
	components: {},
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
					content: this.description
				},
				{
					hid: 'og:description',
					name: 'og:description',
					content: this.description
				},
				{
					hid: 'og:image',
					name: 'og:image',
					content: this.getStorageNews + this.coverArticleMeta.src
				},
				{
					hid: 'og:image:url',
					name: 'og:image:url',
					content: this.getStorageNews + this.coverArticleMeta.src
				},
				{
					hid: 'og:image:secure_url',
					name: 'og:image:secure_url',
					content: this.getStorageNews + this.coverArticleMeta.src
				},
				{
					hid: 'og:image:width',
					name: 'og:image:width',
					content: this.coverArticleMeta.width
				},
				{
					hid: 'og:image:height',
					name: 'og:image:height',
					content: this.coverArticleMeta.height
				},
				{
					hid: 'og:type',
					name: 'og:type',
					content: 'article'
				},
				{
					hid: 'og:url',
					name: 'og:url',
					content:
						this.$store.state.baseurl + 'news/' + this.slug + '/'
				},
				{
					hid: 'author',
					name: 'author',
					content: this.$store.state.lang.news.author
				},
				{
					hid: 'article:author',
					name: 'article:author',
					content: this.$store.state.baseurl
				},
				{
					hid: 'article:published_time',
					name: 'article:published_time',
					content: moment(this.created_at * 1000)
						.utc()
						.format()
				}
			],
			bodyAttrs: {
				class: 'body-pages-standart'
			},
			link: [
				{
					hid: 'image_src',
					rel: 'image_src',
					href: this.getStorageNews + this.coverArticleMeta.src
				},
				{
					hid: 'canonical',
					rel: 'canonical',
					href: this.$store.state.baseurl + 'news/' + this.slug
				}
			]
		}
	},

	async asyncData({ params, store, redirect }) {
		try {
			moment.locale(store.state.locale)

			let regex = /^([0-9]*)-([a-z0-9-]*)/gm
			let m = regex.exec(params.slug)
			let id = m[1]

			let { data } = await axios.get(
				`${store.state.api}methods/news/${id}`
			)

			if (!data.response.length < 1) {
				redirect(404)
			}

			if (data.response.slug !== params.slug) {
				redirect('/news/' + data.response.slug)
			}

			// let description = unilNews.getNewsDescription(data.response.content)
			let coverArticleMeta = data.response.photos[0].standart

			return {
				next: false,
				prev: false,
				// description,
				coverArticleMeta,
				...data.response
			}
		} catch (error) {
			console.log(error)
		}
	},
	data() {
		return {
			// title: '',
			// description: null,
			coverArticleMeta: null,
			imageViewer: null,
			next: false,
			prev: false
		}
	},

	computed: {
		formatedText() {
			return formatedText(this.content)
		},
		datePost() {
			let date = new Date(this.created_at * 1000)

			let mounts = [
				'января',
				'февраля',
				'марта',
				'апреля',
				'мая',
				'июня',
				'июля',
				'августа',
				'сентября',
				'октября',
				'ноября',
				'декабря'
			]
			return moment(this.created_at * 1000).calendar()
		},
		getStorageNews() {
			return this.$store.state.storage + '/images/news/'
		}

		// title() {
		// 	// return `${this.$store.state.lang.news.create} ${
		// 	// 	this.datePost
		// 	// } | TakNePoidet`
		// 	console.log()
		// 	return 'Якин никита | ' + getNewsTitlePage(this.content)
		// },

		// slug() {
		// 	return this.id + '-' + slug(getNewsTitlePage(this.content))
		// }

		// description() {
		// 	return `${this.$store.state.lang.news.create} ${
		// 		this.datePost
		// 	} | TakNePoidet`
		// }
	},
	created() {
		if (process.browser) {
			moment.locale(this.$store.state.locale)
		}
	},
	methods: {
		InstallImageViewer(link) {
			let ImageViewer = new window.ImageViewer()
			ImageViewer.show(link)
		},
		moment(...value) {
			return moment({ value })
		},
		dateFormatPost() {
			return moment(this.created_at * 1000).calendar()
		}
	}
}
</script>
