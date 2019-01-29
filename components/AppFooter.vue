<template>
	<footer id="footer" class="footer">
		<div class="footer__language">
			<a
				v-for="lang in getLanguageList"
				:key="lang"
				:class="[(getLocale === lang) ? 'active' : '']"
				href="#"
				@click="setLocale(lang, $event)"
			>{{ $store.state.lang.main.language[lang] }}</a>
		</div>

		<b>
			TakNePoidet
			<i class="far fa-copyright"/>
			{{ new Date().getFullYear() }}
		</b>
		<br>
		<small>By {{ $store.state.lang.section.footer.name }}</small>

		<div class="footer__themes">
			<button
				:class="{'not-active':getThemes !== 'dark'}"
				data-set-theme="dark"
				@click="setThemes('dark', $event)"
			/>
			<button
				:class="{'not-active':getThemes !== 'light'}"
				data-set-theme="light"
				@click="setThemes('light', $event)"
			/>
		</div>
	</footer>
</template>
<script>
// import {  } from 'vuex';
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
	data() {
		return {}
	},

	computed: mapGetters(['getLanguageList', 'getLocale', 'getThemes']),

	methods: {
		setLocale(locale, $event) {
			$event.preventDefault()
			this.$store.dispatch('setLocale', locale)
		},
		setThemes(theme, $event) {
			$event.preventDefault()
			this.$store.dispatch('setThemes', theme)
		}
	}
}
</script>
