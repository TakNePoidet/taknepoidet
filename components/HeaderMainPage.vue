<template>
	<header :class="[open ? 'open' : '', fixed ? 'fixed' : '']"
		class="header-main-page">
		<div class="header-main-page__wrap">
			<div class="header-main-page__logo">
				<nuxt-link to="/">
					<app-logo/>
				</nuxt-link>
			</div>
			<div class="header-main-page__bars"
				@click="open = !open">
				<i class="fas fa-bars"/>
			</div>
		</div>
		<nav class="mainnav">
			<ul ref="mainnav"
				:class="{scroll: scrollMainnav}">
				<li>
					<a v-scroll-to="'#home'"
						href="#home"
						@click="open = false">{{ $store.state.lang.header.home }}</a>
				</li>
				<li>
					<a
						v-scroll-to="'#about'"
						href="#about"
						@click="open = false"
					>{{ $store.state.lang.header.about_me }}</a>
				</li>
				<li>
					<a
						v-scroll-to="'#news'"
						href="#news"
						@click="open = false"
					>{{ $store.state.lang.header.records }}</a>
				</li>
				<li>
					<a
						v-scroll-to="'#social'"
						href="#social"
						@click="open = false"
					>{{ $store.state.lang.header.contacts }}</a>
				</li>
				<li>
					<a
						v-scroll-to="'#landing-list'"
						href="#landing-list"
						@click="open = false"
					>{{ $store.state.lang.header.landing_list }}</a>
				</li>
				<li>
					<a
						v-scroll-to="'#project'"
						href="#project"
						@click="open = false"
					>{{ $store.state.lang.header.projects }}</a>
				</li>
			</ul>
		</nav>
	</header>
</template>
<script>
import { mapState } from "vuex";
import AppLogo from "~/components/AppLogo.vue";

export default {
	components: {
		AppLogo
	},
	data() {
		return {
			open: false,
			fixed: false,
			scrollMainnav: false
		};
	},

	computed: mapState(["baseurl"]),
	watch: {
		open() {
			this.$nextTick(function() {
				this.isScrollMainnav();
			});
		},
		fixed() {
			this.$nextTick(function() {
				this.isScrollMainnav();
			});
		}
	},
	mounted() {
		if (process.browser) {
			window.addEventListener("resize", this.windowResize);
			this.$refs.mainnav.addEventListener(
				"mousewheel",
				this.onScrollMainNav
			);
			this.isScrollMainnav();
		}
	},
	beforeDestroy() {
		if (process.browser) {
			window.removeEventListener("resize", this.windowResize);
			this.$refs.mainnav.removeEventListener(
				"mousewheel",
				this.onScrollMainNav
			);
		}
	},
	methods: {
		scrollTo(anchor, event) {
			event.preventDefault();
			const box = this.$root.$el.querySelector(
				`[data-anchor="${anchor}"]`
			);

			if (box) {
				box.scrollIntoView();
			}
		},
		onScrollMainNav(e) {
			if (e) {
				e.preventDefault();
				const evt = e.originalEvent;
				let position = this.$refs.mainnav.scrollLeft;
				position += e.deltaY < 0 ? -120 : 120;
				this.$refs.mainnav.scrollLeft = position;
			}
		},
		isScrollMainnav() {
			const ul = this.$refs.mainnav;
			if (ul.scrollWidth - ul.clientWidth > 0) {
				this.scrollMainnav = true;
			} else {
				this.scrollMainnav = false;
			}
		},
		windowResize() {
			this.isScrollMainnav();
		}
	}
};
</script>
