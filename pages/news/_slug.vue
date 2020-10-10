<template>
	<main>
		<div class="section-news-page">
			<article class="news-single-page">
				<div class="news-single-page__content">
					<template v-for="(item, key) in getParagraph">
						<p v-if="item.type === 'text'"
							:key="key"
							v-html="item.content"/>

						<figure v-if="item.type === 'photos'"
							:key="key">
							<img
								:src="$store.state.storage + '/images/news/' + item.content.standart.src"
								:width="`${item.content.standart.width}px`"
								:height="`${item.content.standart.height}px`"
								@click="InstallImageViewer($store.state.storage + '/images/news/' + item.content.original.src)"
							>
						</figure>
					</template>
					<p class="news-single-page__time">
						<time :title="moment(created_at * 1000).utc().format()">
							<i>{{ dateFormatPost() }}</i>
						</time>
					</p>
				</div>

				<div
					v-if="prev || next"
					:class="['news-single-page__other', ((prev && !next) ? 'news-single-page__not-next' : '')]"
				>
					<nuxt-link v-if="next"
						:to="`/news/${next.slug}/`"
						class="news-single-page__next">
						<img
							:src="$store.state.storage + '/images/news/' + next.cover.min.src"
							:srcset="$store.state.storage + '/images/news/' + next.cover.normal.src + ' 2x'"
						>
						<div>
							<i class="fas fa-arrow-left"/>
							{{ $store.state.lang.news.prev }}
						</div>
					</nuxt-link>
					<nuxt-link v-if="prev"
						:to="`/news/${prev.slug}/`"
						class="news-single-page__prev">
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
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import moment from "moment";
import {
	formatedText,
	getNewsTitlePage,
	getRandEmoii
} from "~/assets/js/util/news";
import slug from "~/assets/js/util/slug/index";
import { createMetaTag, createLinkTag } from "~/assets/js/util/meta";

moment.locale();

export default {
	scrollToTop: true,
	validate({ params }) {
		const regex = /^([0-9]*)-([a-z0-9-]*)/gm;
		return regex.exec(params.slug) !== null;
	},
	components: {},
	layout: "pages-standart",
	head() {
		return {
			title: this.title,

			meta: [
				...createMetaTag(this, {
					title: this.title,
					description: this.description,
					image: {
						src: `${this.$store.state.storage}/images/news/${
							this.coverArticleMeta.src
						}`,
						width: this.coverArticleMeta.width,
						height: this.coverArticleMeta.height
					},
					"og:type": "article",
					"og:url": `${this.$store.state.baseurl}news/${this.slug}/`,
					author: this.$store.state.lang.news.author,
					"article:author": this.$store.state.baseurl,
					"article:published_time": moment(this.created_at * 1000)
						.utc()
						.format(),
					"rand:emoji": getRandEmoii()
				})
			],

			bodyAttrs: {
				class: "body-pages-standart"
			},
			link: [
				...createLinkTag(this, {
					image_src: this.getStorageNews + this.coverArticleMeta.src,
					canonical: `${this.$store.state.baseurl}news/${this.slug}`
				})
			]
		};
	},

	async asyncData({ params, store, redirect }) {
		try {
			moment.locale(store.state.locale);

			const regex = /^([0-9]*)-([a-z0-9-]*)/gm;
			const m = regex.exec(params.slug);
			const id = m[1];

			const { data } = await axios.get(
				`${store.state.api}methods/news/${id}`
			);

			if (!data.response.length < 1) {
				redirect(404);
			}

			if (data.response.slug !== params.slug) {
				redirect(`/news/${data.response.slug}`);
			}

			// let description = unilNews.getNewsDescription(data.response.content)
			const coverArticleMeta = data.response.photos[0].standart;

			return {
				next: false,
				prev: false,
				// description,
				coverArticleMeta,
				...data.response
			};
		} catch (error) {
			console.log(error);
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
		};
	},

	computed: {
		formatedText() {
			return formatedText(this.content);
		},
		datePost() {
			const date = new Date(this.created_at * 1000);

			const mounts = [
				"января",
				"февраля",
				"марта",
				"апреля",
				"мая",
				"июня",
				"июля",
				"августа",
				"сентября",
				"октября",
				"ноября",
				"декабря"
			];
			return moment(this.created_at * 1000).calendar();
		},
		getStorageNews() {
			return `${this.$store.state.storage}/images/news/`;
		},
		getParagraph() {
			const { formatedText, photos } = this;
			const countParagraph = formatedText.length;
			const countImages = photos.length;

			let indexParagraph = 0;
			let indexImages = 0;

			const paragraph = [];
			while (indexParagraph < countParagraph) {
				paragraph.push({
					type: "text",
					content: formatedText[indexParagraph]
				});
				if (
					photos[indexImages] &&
					indexParagraph % 3 == 0 &&
					indexImages < countImages - 1
				) {
					paragraph.push({
						type: "photos",
						content: photos[indexImages]
					});
					indexImages++;
				}
				indexParagraph++;
			}

			while (indexImages < countImages) {
				paragraph.push({
					type: "photos",
					content: photos[indexImages]
				});
				indexImages++;
			}
			return paragraph;
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
			moment.locale(this.$store.state.locale);
		}
	},
	methods: {
		InstallImageViewer(link) {
			const ImageViewer = new window.ImageViewer();
			ImageViewer.show(link);
		},
		moment(...value) {
			return moment({ value });
		},
		dateFormatPost() {
			return moment(this.created_at * 1000).calendar();
		}
	}
};
</script>
