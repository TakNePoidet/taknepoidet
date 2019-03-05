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
export default {
	components: {
		ProjectItem
	},
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
					content: this.$store.state.lang.page.project.description
				},
				{
					hid: 'og:description',
					name: 'og:description',
					content: this.$store.state.lang.page.project.description
				},
				{
					hid: 'og:image',
					name: 'og:image',
					content: '/images/cover-site-project.jpg'
				},
				{
					hid: 'og:image:url',
					name: 'og:image:url',
					content: '/images/cover-site-project.jpg'
				},
				{
					hid: 'og:image:secure_url',
					name: 'og:image:secure_url',
					content: '/images/cover-site-project.jpg'
				},
				{
					hid: 'og:url',
					name: 'og:url',
					content: this.$store.state.baseurl + 'project/'
				}
			],
			bodyAttrs: {
				class: 'body-pages-standart'
			},
			link: [
				{
					hid: 'image_src',
					rel: 'image_src',
					href: '/images/cover-site-project.jpg'
				},
				{
					hid: 'canonical',
					rel: 'canonical',
					href: this.$store.state.baseurl + 'project/'
				}
			]
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
