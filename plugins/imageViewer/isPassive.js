// isPassive
function isPassive() {
	let supportsPassiveOption = false;
	try {
		addEventListener(
			"test",
			null,
			Object.defineProperty({}, "passive", {
				get() {
					supportsPassiveOption = true;
				}
			})
		);
	} catch (e) {}
	return supportsPassiveOption;
}

export default isPassive;
