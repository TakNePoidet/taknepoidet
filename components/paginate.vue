<template>
	<ul v-if="paginate.length > 1"
		class="pagination">
		<li
			v-for="page in paginate"
			:key="page.num"
			:class="['page-item', (page.disabled) ? 'disabled' : '',(page.active) ? 'active' : '']"
		>
			<nuxt-link
				:to="!page.disabled ? parentLink + '?page=' + page.num : '#'"
				class="page-link"
			>{{ page.text }}</nuxt-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		current: {
			type: Number,
			default: () => null
		},
		all: {
			type: Number,
			default: () => null
		},
		show: {
			type: Number,
			default: () => 3
		},

		countPage: {
			type: Number,
			default: () => 0
		},

		parentLink: {
			type: String,
			default: () => "/"
		}
	},

	computed: {
		paginate() {
			const { current, all, show, parentLink, countPage } = this;

			const max = Math.round(all / countPage) + 1;
			const pagination = [];
			let dount_prev = 0;
			let dount_last = 0;
			// let show = 3;

			for (let i = 0; i < max; i++) {
				let page = {};
				const page_num = i + 1;
				if (
					page_num > 1 &&
					page_num < max &&
					((page_num < current - show && page_num > 1 + show) ||
						(page_num > current + show && page_num < max - show))
				) {
					if (page_num < current - show && dount_prev == 0) {
						page = {
							disabled: true,
							active: false,
							text: "...",
							num: page_num
						};
						dount_prev = 1;
						pagination.push(page);
					}
					if (page_num > current + show && dount_last == 0) {
						page = {
							disabled: true,
							active: false,
							text: "...",
							num: page_num
						};
						dount_last = 1;
						pagination.push(page);
					}
				} else {
					page = {
						num: page_num,
						disabled: false,
						active: current === page_num,
						text: page_num
					};
					pagination.push(page);
				}
			}
			return pagination;
		}
	}
};
</script>
