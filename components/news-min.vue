<template>
	<div
		v-if="data"
		:class="[(animation) ? 'wow' : '', animation ? 'bounceInUp' : '', 'news', `news--${data.reversing}`, ((!isMobile) ? 'news--hover' : 'news--swipe')]"
	>
		<div class="news__cover">
			<img
				:src="$store.state.storage + '/images/news/' + data.cover.normal.src"
				:alt="data.content"
				:srcset="$store.state.storage + '/images/news/' + data.cover.retina.src + ' 2x'"
				:width="`${data.cover.normal.width}px`"
				:height="`${data.cover.normal.height}px`"
			>
		</div>
		<div class="news__content">
			<div class="swipe">
				<div class="swipe-panel">
					<div/>
					<div
						:style="{
							background: `-webkit-gradient(linear, left top, right top, from(transparent), to(${ data.color }))`,
							background: `linear-gradient(to right, transparent 0%, ${ data.color } 100%)`

						}"
						class="news__content__empty"
					/>
					<div
						:style="{background: (!isMobile) ? convertHex(data.color) : data.color}"
						class="news__content__text"
					>
						<p>{{ data.content | capitalize }}</p>
						<nuxt-link :to="`/news/${data.slug}/`"
							class="news__more">{{ $store.state.lang.news.more }}</nuxt-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getNewsDescription } from "~/assets/js/util/news";

export default {
	filters: {
		capitalize: getNewsDescription
	},
	props: {
		data: {
			type: Object,
			default: () => null
		},
		animation: {
			type: Boolean,
			default: () => false
		}
	},

	data() {
		return {
			slider: null,
			isMobile: false
		};
	},
	mounted() {
		if (process.browser) {
			this.init();
			window.addEventListener("resize", this.init);
		}
	},

	beforeDestroy() {
		if (process.browser && this.slider) {
			this.slider.destroy();
			this.slider = null;
		}
		if (process.browser) {
			window.removeEventListener("resize", this.init);
		}
	},
	methods: {
		convertHex(color) {
			color = color.replace("#", "");
			const r = parseInt(color.substring(0, 2), 16);
			const g = parseInt(color.substring(2, 4), 16);
			const b = parseInt(color.substring(4, 6), 16);
			const result = `rgba(${r},${g},${b},${85 / 100})`;
			return result;
		},

		init() {
			const device = Device();
			this.isMobile = device.isMobile() || device.isTablet();
			if (this.isMobile) {
				if (!this.slider) {
					this.slider = SwipeSlider(
						this.$el.querySelector(".swipe"),
						{
							infinite: false,
							slidesToScroll: 2,
							dots: true
						}
					);
				}
			} else if (this.slider) {
				this.slider.destroy();
				this.slider = null;
			}
		}
	}
};
</script>
