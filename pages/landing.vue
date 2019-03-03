<template>
	<main>
		<div class="section-landing">
			<h2 class="section-title">{{ $store.state.lang.section.landing_list.title }}</h2>
			<div ref="grid-landing" class="grid-landing">
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
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import MadeInBananStydio from '~/components/MadeInBananStydio.vue'
export default {
	layout: 'landing',
	head() {
		return {
			title: this.title,
			meta: [
				{ name: 'viewport', content: 'width=1200,user-scalable=yes' },
				{
					hid: 'description',
					name: 'description',
					content: this.description
				}
			],
			bodyAttrs: {
				class: 'body-landing-page'
			}
		}
	},
	components: {
		MadeInBananStydio
	},
	async asyncData({ params, store }) {
		try {
			let { data } = await axios.get(`${store.state.api}methods/landing`)
			return {
				landing: data,
				title: store.state.lang.page.landing.title,
				description: store.state.lang.page.landing.description
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
	},
	computed: {
		...mapGetters(['getLocale'])
	},
	mounted() {
		if (process.browser) {
			var Masonry = require('masonry-layout')
			let masonry = new Masonry(this.$refs['grid-landing'], {
				itemSelector: '.grid-landing-item',
				columnWidth: 350,
				gutter: 30
			})
		}
	},

	methods: {
		shuffle(sourceArray) {
			for (var i = 0; i < sourceArray.length - 1; i++) {
				var j = i + Math.floor(Math.random() * (sourceArray.length - i))

				var temp = sourceArray[j]
				sourceArray[j] = sourceArray[i]
				sourceArray[i] = temp
			}
			return sourceArray
		},
		rand_landing() {
			if (process.browser) {
				let fullCopy = this.landing.slice()
				let rand_landing = fullCopy.sort(function(a, b) {
					return Math.random() - 0.5
				})
				return rand_landing
			}
		}
	}
}
</script>
