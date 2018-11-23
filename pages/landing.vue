<template>
	<main>

		<div class="section-landing">
			<h2 class="section-title">
				{{$store.state.lang.section.landing_list.title}}
			</h2>
			<div class="grid" ref="grid">
				<div class="grid-item bounceInUp" v-for="(item, key) in rand_landing()" :key="item.key" :class="[key > 3 ? 'wow' : '']">
					<div class="grid-item__title">{{item.title[getLocale]}}</div>
					<div class="grid-item__images">
						<a :href="item.link" target="_blank" rel="nofollow">
							<img :src="`${$store.state.api}images/landing/normal/${item.filename}@1x.jpg`" 
								 :alt="item.title"
								 :srcset="`${$store.state.api}images/landing/normal/${item.filename}@2x.jpg`"
								 :width="item.images.normal.width + 'px'" 
								 :height="item.images.normal.height + 'px'"
							>
						</a>
					</div>
				</div>
			</div>

			<div class="madeinbananstydio">
				<a class="madeinbananstydio__link" rel="nofollow" href="https://www.instagram.com/studiya.banan/">
					<div class="madeinbananstydio__text">{{$store.state.lang.page.landing.banan}}</div>
					<div class="madeinbananstydio__logo"></div>
				</a>
			</div>
		</div>
	</main>
</template>

<script>
import axios from 'axios'
import { mapActions,mapGetters } from 'vuex';
export default {


	layout: 'landing',
	head () {
		return {
			title: this.title,
			meta: [
				{ name: 'viewport', content: 'width=1200,user-scalable=yes' },
				{ hid: 'description', name: 'description', content: this.description },
			],
			bodyAttrs: {
	      		class: 'body-landing-page'
	    	}
		}
	},


	async asyncData ({ params, store }) {

		let { data } = await axios.get(`${store.state.api}method/landing`);
		return {
			landing 	: data,
			title 		: store.state.lang.page.landing.title,
			description : store.state.lang.page.landing.description,

		}
	},
	data() {
		return {
			landing: [],
			description : '',
			title 		: '',
		}
	},
	mounted() {
		if (process.browser) {
			var Masonry = require('masonry-layout');
			let masonry = new Masonry(this.$refs.grid, {
				itemSelector: '.grid-item',
				columnWidth: 350,
				gutter: 30
			});
		}
	},
	computed: {
		...mapGetters([
			'getLocale'
		])
	},
	methods : {
		shuffle(sourceArray) {
			for (var i = 0; i < sourceArray.length - 1; i++) {
				var j = i + Math.floor(Math.random() * (sourceArray.length - i));

		        var temp = sourceArray[j];
		        sourceArray[j] = sourceArray[i];
		        sourceArray[i] = temp;
		    }
			return sourceArray
		},
		rand_landing() {
			if (process.browser) {
				let fullCopy = this.landing.slice();
				let rand_landing = fullCopy.sort(function (a, b) {return Math.random() - 0.5;});
				return rand_landing;
			}
		},

	}
}
</script>