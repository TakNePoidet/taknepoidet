<template>
	<main>
		<div class="project">
			<h1 class="page-title">{{ $store.state.lang.section.project.title }}</h1>
			<div class="project__wrap">
				<project-item
					v-for="(item, key) of project"
					:key="item.link"
					:index="key + 1"
					:data="item"
					:animation-type="['slideInLeft', 'slideInRight']"
					:animation="true"
				/>
			</div>
		</div>
	</main>
</template>

<script>
// import SwipeSlider from '~/plugins/SwipeSlider.js'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import ProjectItem from '~/components/ProjectItem.vue'
import { createMetaTag, createLinkTag } from '~/assets/js/util/meta'
export default {
	components: {
		ProjectItem
	},
	layout: 'pages-standart',
	head() {
		return {
			title: this.title,

			meta: [
				...createMetaTag(this, {
					title: this.title,
					description: this.$store.state.lang.page.project
						.description,
					image: {
						src: '/images/cover-site-project.jpg',
						width: 1200,
						height: 600
					},
					'og:url': this.$store.state.baseurl + 'project/'
				})
			],
			link: [
				...createLinkTag(this, {
					image_src: '/images/cover-site-project.jpg',
					canonical: this.$store.state.baseurl + 'project/'
				})
			],

			bodyAttrs: {
				class: 'body-pages-standart'
			}
		}
	},

	async asyncData({ query, params, store }) {
		try {
			let { data } = await axios.get(`${store.state.api}methods/project`)
			return {
				project: data,
				title: store.state.lang.section.project.title
			}
		} catch (error) {
			console.log(error)
		}
	},
	data() {
		return {
			project: [],
			title: ''
		}
	}
}
</script>
