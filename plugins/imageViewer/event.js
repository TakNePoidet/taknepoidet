import isPassive from "./isPassive";

function TouchEvent(container, options) {
	this.container = container;
	// an enpty function
	const noop = function() {};
	this.onStart = options.onStart || noop;
	this.onMove = options.onMove || noop;
	this.onEnd = options.onEnd || noop;
	this.onMouseWheel = options.onMouseWheel || noop;
	this.onClick = options.onClick || noop;
	this.onPinch = options.onPinch || noop;
}
TouchEvent.prototype.init = function() {
	const self = this;
	this.startHandle = function startHandle(estart) {
		estart.preventDefault();
		const eventType = estart.type;

		const touchMove =
			eventType === "touchstart" ? "touchmove" : "mousemove";
		const touchEnd = eventType === "touchstart" ? "touchend" : "mouseup";

		// 注意先后顺序，如果先拿 touches 的容易报错
		const sx = estart.clientX || estart.touches[0].clientX;
		const sy = estart.clientY || estart.touches[0].clientY;

		const start = self.onStart(estart, {
			x: sx,
			y: sy
		});

		if (start === false) return;

		if (eventType === "touchstart" && estart.touches[1]) {
			self.onPinch(estart);
		}

		function moveListener(emove) {
			emove.preventDefault();

			// get the cordinates
			const mx = emove.clientX || emove.touches[0].clientX;
			const my = emove.clientY || emove.touches[0].clientY;

			self.onMove(emove, {
				dx: mx - sx,
				dy: my - sy,
				mx,
				my
			});
		}
		function endListener(emove) {
			document.removeEventListener(touchMove, moveListener);
			document.removeEventListener(touchEnd, endListener);

			const mx = emove.clientX;
			const my = emove.clientY;
			self.onEnd(emove, {
				dx: mx - sx,
				dy: my - sy,
				mx,
				my
			});
		}
		let _e = false;
		if (touchMove === "touchmove" && isPassive()) {
			_e = {
				capture: false,
				passive: false
			};
		}
		document.addEventListener(touchMove, moveListener, _e);
		document.addEventListener(touchEnd, endListener);
	};

	this.container.addEventListener("touchstart", this.startHandle, false);
	this.container.addEventListener("mousedown", this.startHandle, false);
	this.container.addEventListener("mousewheel", this.onMouseWheel, false);
	this.container.addEventListener("click", this.onClick, false);

	return this;
};

TouchEvent.prototype.destroy = function() {
	this.container.removeEventListener("touchstart", this.startHandle);
	this.container.removeEventListener("mousedown", this.startHandle);
	this.container.removeEventListener("mousewheel", this.onMouseWheel);
	this.container.removeEventListener("click", this.onClick);
};

export default TouchEvent;
