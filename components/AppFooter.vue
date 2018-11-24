<template>
	<footer id="footer" class="footer">
		
		<div class="footer__language">
			<a 
				v-for="lang in getLanguageList" :key="lang" :class="[(getLocale === lang) ? 'active' : '']" href="#" 
				@click="setLocale(lang, $event)">
				{{ $store.state.lang.main.language[lang] }}
			</a>
		</div>
		
		<b>TakNePoidet <i class="far fa-copyright"/> 
			{{ new Date().getFullYear() }}</b><br>
		<small>By {{ $store.state.lang.section.footer.name }}</small>

	</footer>
</template>
<script>
// import {  } from 'vuex';
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
	data() {
		return {}
	},

	computed: mapGetters(['getLanguageList', 'getLocale']),

	methods: {
		setLocale(locale, $event) {
			$event.preventDefault()
			this.$store.dispatch('setLocale', locale)
		}
	}
}
</script>
