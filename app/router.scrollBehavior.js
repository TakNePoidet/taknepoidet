// @ts-nocheck

export default function(to, from, savedPosition) {
	let position = false;

	position = { x: 0, y: 0 };

	return new Promise(resolve => {
		window.$nuxt.$once("triggerScroll", () => {
			if (to.hash && document.querySelector(to.hash)) {
				position = { selector: to.hash };
			}
			resolve(position);
		});
	});
}
