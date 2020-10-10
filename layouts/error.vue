<template>
	<div class="error">
		<h1 v-if="error.statusCode === 404">Page not found</h1>
		<nuxt-link to="/">Home page!</nuxt-link>
	</div>
</template>

<script>
export default {
	props: {
		error: {
			type: Object,
			default: null
		}
	}
};
</script>
<style lang="scss" scoped>
.error {
	width: 100%;
	height: 100vh;
	font-size: 3vh;
	padding: 1vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
</style>
