<template>
	<div
		v-if="data"
		:class="[(animation) ? 'wow' : '', animation ? 'bounceInUp' : '', 'news', `news--${data.reversing}`, ((!isMobile) ? 'news--hover' : 'news--swipe')]"
	>
		<div class="news__cover">
			<img
				:src="$store.state.storage + '/images/news/' + data.cover[0]"
				:alt="data.content"
				:srcset="$store.state.storage + '/images/news/' + data.cover[1] + ' 2x'"
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
						<a
							:href="`https://vk.com/wall20513451_${data.vk_id}`"
							class="news__more"
							target="_blank"
						>{{ $store.state.lang.news.more }}</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	filters: {
		capitalize: function(value) {
			if (!value) return ''

			if (value.length > 100) {
				let rtrim = function rtrim(str, charlist) {
					charlist = charlist.replace(
						/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
						'$1'
					)
					let re = new RegExp('[' + charlist + ']+$', 'g')
					return str.replace(re, '')
				}

				value = value.replace('\n', ' ')
				let regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm
				value = value.replace(regex, (...matches) => {
					return matches[3]
				})

				value = value.replace(/<\/?[^>]+>/gi, '')
				value = value.substring(0, 100)
				value = rtrim(value, '!,.-')

				value = value.substring(0, value.lastIndexOf(' '))
				value += '...'
			}

			return value
		}
	},
	props: {
		data: {
			type: Object,
			default: () => {
				return null
			}
		},
		animation: {
			type: Boolean,
			default: () => {
				return false
			}
		}
	},

	data() {
		return {
			slider: null,
			isMobile: false
		}
	},
	mounted() {
		if (process.browser) {
			this.init()
			window.addEventListener('resize', this.init)
		}
	},

	beforeDestroy() {
		if (process.browser && this.slider) {
			this.slider.destroy()
			this.slider = null
		}
		if (process.browser) {
			window.removeEventListener('resize', this.init)
		}
	},
	methods: {
		convertHex: function(color) {
			color = color.replace('#', '')
			let r = parseInt(color.substring(0, 2), 16)
			let g = parseInt(color.substring(2, 4), 16)
			let b = parseInt(color.substring(4, 6), 16)
			let result = 'rgba(' + r + ',' + g + ',' + b + ',' + 85 / 100 + ')'
			return result
		},

		init() {
			let device = Device()
			this.isMobile = device.isMobile() || device.isTablet()

			if (this.isMobile) {
				if (!this.slider) {
					this.slider = SwipeSlider(
						this.$el.querySelector('.swipe'),
						{
							infinite: false,
							slidesToScroll: 2,
							dots: true
						}
					)
				}
			} else {
				if (this.slider) {
					this.slider.destroy()
					this.slider = null
				}
			}
		}
	}
}
</script>
<style lang="scss" scoped>
button {
}
</style>
