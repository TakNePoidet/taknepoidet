<template>
	<div
		v-if="data"
		:class="['project__item', {wow: animation}, animationType ? setAnimationType() : 'flipInX']"
	>
		<a :href="data.link"
			target="_blank">
			<div class="project__images">
				<img
					:src="`${$store.state.storage}/images/projects/${data.images}.jpg`"
					:srcset="`${$store.state.storage}/images/projects/${data.images}@2x.jpg 2x`"
				>
			</div>
			<div class="project__name">{{ data.title[getLocale] }}</div>
		</a>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	props: {
		data: {
			type: Object,
			default: () => null
		},
		animation: {
			type: Boolean,
			default: () => false
		},
		animationType: {
			type: [String, Array],
			default: () => ""
		},
		index: {
			type: Number,
			default: () => false
		}
	},

	data() {
		return {};
	},
	computed: {
		...mapGetters(["getLocale"])
	},
	methods: {
		setAnimationType() {
			const { animationType } = this;
			if (typeof animationType === "string") {
				return animationType;
			}
			if (typeof animationType === "object") {
				return this.index & 1 ? animationType[0] : animationType[1];
			}
		}
	}
};
</script>
