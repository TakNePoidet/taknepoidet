<template>
	<main>
		<div class="section-landing">
			<h2 class="section-title">{{ $store.state.lang.section.landing_list.title }}</h2>
			<div ref="grid-landing"
				class="grid-landing">
				<div
					v-for="(item, key) in rand_landing()"
					:key="item.key"
					:class="[key > 3 ? 'wow' : '']"
					class="grid-landing-item bounceInUp"
				>
					<div class="grid-landing-item__title">{{ item.title[getLocale] }}</div>
					<div class="grid-landing-item__images">
						<a
							:href="(item.link) ? item.link : `${$store.state.storage}/images/landing/full/${item.filename}@1x.jpg`"
							target="_blank"
							rel="nofollow"
						>
							<img
								:src="`${$store.state.storage}/images/landing/normal/${item.filename}@1x.jpg`"
								:alt="item.title[getLocale]"
								:srcset="`${$store.state.storage}/images/landing/normal/${item.filename}@2x.jpg`"
								:width="item.images.normal.width + 'px'"
								:height="item.images.normal.height + 'px'"
							>
						</a>
					</div>
				</div>
			</div>
			<made-in-banan-stydio/>
		</div>
	</main>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import MadeInBananStydio from "~/components/MadeInBananStydio.vue";
import { createMetaTag, createLinkTag } from "~/assets/js/util/meta";

export default {
	layout: "landing",
	head() {
		return {
			title: this.title,
			meta: [
				...createMetaTag(this, {
					viewport: "width=1200,user-scalable=yes",
					title: this.title,
					description: this.description,
					image: {
						src: "/images/cover-site-landing.jpg",
						width: 1200,
						height: 600
					},
					"og:url": `${this.$store.state.baseurl}landing/`
				})
			],
			link: [
				...createLinkTag(this, {
					image_src: "/images/cover-site-landing.jpg",
					canonical: `${this.$store.state.baseurl}landing/`
				})
			],
			bodyAttrs: {
				class: "body-landing-page"
			}
		};
	},
	components: {
		MadeInBananStydio
	},
	async asyncData({ params, store }) {
		try {
			const { data } = await axios.get(
				`${store.state.api}methods/landing`
			);
			return {
				landing: data,
				title: store.state.lang.page.landing.title,
				description: store.state.lang.page.landing.description
			};
		} catch (error) {
			console.log(error);
		}
	},
	data() {
		return {
			landing: [],
			description: "",
			title: ""
		};
	},
	computed: {
		...mapGetters(["getLocale"])
	},
	mounted() {
		if (process.browser) {
			const Masonry = require("masonry-layout");
			const masonry = new Masonry(this.$refs["grid-landing"], {
				itemSelector: ".grid-landing-item",
				columnWidth: 350,
				gutter: 30
			});
		}
	},

	methods: {
		shuffle(sourceArray) {
			for (let i = 0; i < sourceArray.length - 1; i++) {
				const j =
					i + Math.floor(Math.random() * (sourceArray.length - i));

				const temp = sourceArray[j];
				sourceArray[j] = sourceArray[i];
				sourceArray[i] = temp;
			}
			return sourceArray;
		},
		rand_landing() {
			if (process.browser) {
				const fullCopy = this.landing.slice();
				const rand_landing = fullCopy.sort(
					(a, b) => Math.random() - 0.5
				);
				return rand_landing;
			}
		}
	}
};
</script>
