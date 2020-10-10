import "./style.scss";

import TouchEvent from "./event";
import isPassive from "./isPassive";

const ZOOM_CONSTANT = 15;
const MOUSE_WHEEL_COUNT = 5;

const preventDefaultCb = e => e.preventDefault();
function easeOutQuart(t, b, c, d) {
	t /= d;
	t--;
	return -c * (t * t * t * t - 1) + b;
}

(function() {
	let lastTime = 0;
	if (window.requestAnimationFrame) {
		return;
	}
	const vendors = ["ms", "moz", "webkit", "o"];
	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame =
			window[`${vendors[x]}RequestAnimationFrame`];
		window.cancelAnimationFrame =
			window[`${vendors[x]}CancelAnimationFrame`] ||
			window[`${vendors[x]}CancelRequestAnimationFrame`];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback) {
			const currTime = new Date().getTime();
			const timeToCall = Math.max(0, 16 - (currTime - lastTime));
			const id = window.setTimeout(() => {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
})();

/**
 * function to check if image is loaded
 * @param {Node} img en image node
 */
function imageLoaded(img) {
	return (
		img.compvare &&
		(typeof img.naturalWidth === "undefined" || img.naturalWidth !== 0)
	);
}

function ImageViewer(container, options) {
	this.container = container;
	this.options = { ...ImageViewer.defaults, ...options };

	this.zoomValue = 100;

	container.classList.add("image-viewer-container");

	this.imageWrap = container.querySelector(".image-viewer-image-wrap");
	this.closeBtn = container.querySelector(".image-viewer-close");
	this.ImagesOriginal = {};
	this.ImagePosition = {
		x: 0,
		y: 0
	};
}

ImageViewer.prototype = {
	constructor: ImageViewer,
	_init() {
		const viewer = this;
		const { options } = viewer;
		let zooming = false;
		const { container } = viewer;

		let closeSwipe = {};
		const { imageWrap } = viewer;

		let changedDelta = 0;

		let touchtime = 0;
		let point;

		viewer._imageSlider = new TouchEvent(imageWrap, {
			onStart() {
				if (!viewer.loaded) return false;
				if (zooming) return;
				const self = this;
				self.imgWidth = (viewer.imageDim.w * viewer.zoomValue) / 100;
				self.imgHeight = (viewer.imageDim.h * viewer.zoomValue) / 100;

				self.curImgLeft = parseFloat(viewer.ImagePosition.x);
				self.curImgTop = parseFloat(viewer.ImagePosition.y);

				closeSwipe = {
					left: self.curImgLeft,
					top: self.curImgTop,

					end: {
						left: self.curImgLeft,
						top: self.curImgTop
					}
				};
			},
			onMove(e, position) {
				if (zooming) return;

				this.currentPos = position;
				let newLeft = this.curImgLeft + position.dx;
				let newTop = this.curImgTop + position.dy;
				const baseLeft = Math.max(
					(viewer.containerDim.w - this.imgWidth) / 2,
					0
				);
				const baseTop = Math.max(
					(viewer.containerDim.h - this.imgHeight) / 2,
					0
				);
				const baseRight = viewer.containerDim.w - baseLeft;
				const baseBottom = viewer.containerDim.h - baseTop;

				newLeft = Math.min(newLeft, baseLeft);
				newTop = Math.min(newTop, baseTop);

				if (viewer.zoomValue !== 100) {
					if (newLeft + this.imgWidth < baseRight) {
						newLeft = baseRight - this.imgWidth;
					}
					if (newTop + this.imgHeight < baseBottom) {
						newTop = baseBottom - this.imgHeight;
					}
				} else {
					newLeft = baseRight - this.imgWidth;
					newTop = this.curImgTop + position.dy;

					const close = Math.abs(newTop - closeSwipe.top);
					if (close < 200) {
						container.style.background = `rgba(0,0,0,${1 -
							(close * 100) / 200 / 100})`;

						viewer.currentImg.style.opacity =
							1 - (close * 100) / 200 / 100;
					}
				}

				const left = newLeft;
				const top = newTop;

				const _ratio = this.imgWidth / viewer.imageDim.w;
				viewer.currentImg.style.transform = `translate3d(${left}px, ${top}px, 0px ) scale3d(${_ratio}, ${_ratio}, 1)`;
				viewer.ImagePosition = {
					x: left,
					y: top
				};

				closeSwipe.end = {
					left,
					top
				};
			},
			onEnd(e) {
				if (zooming) return;

				if (viewer.zoomValue !== 100) return;

				if (Math.abs(closeSwipe.end.top - closeSwipe.top) < 200) {
					const _ratio = this.imgWidth / viewer.imageDim.w;
					viewer.currentImg.style.transform = `translate3d(${
						closeSwipe.left
					}px, ${
						closeSwipe.top
					}px, 0px ) scale3d(${_ratio}, ${_ratio}, 1)`;
					viewer.ImagePosition = {
						x: closeSwipe.left,
						y: closeSwipe.top
					};
					closeSwipe = {};
					container.style.background = `rgb(0,0,0)`;
					viewer.currentImg.style.opacity = 1;
				} else {
					closeSwipe = {};
					container.style.background = `rgb(0,0,0)`;
					viewer.currentImg.style.opacity = 1;
					viewer._close();
				}
			},
			onMouseWheel(e) {
				if (!options.zoomOnMouseWheel || !viewer.loaded) {
					return;
				}

				const delta = Math.max(-1, Math.min(1, e.wheelDelta));
				const zoomValue =
					(viewer.zoomValue * (100 + delta * ZOOM_CONSTANT)) / 100;

				if (!(zoomValue >= 100 && zoomValue <= options.maxZoom)) {
					changedDelta += Math.abs(delta);
				} else {
					changedDelta = 0;
				}

				if (changedDelta > MOUSE_WHEEL_COUNT) return;

				e.preventDefault();

				const x = e.pageX;
				const y = e.pageY;

				viewer.zoom(zoomValue, {
					x,
					y
				});
			},

			onClick(e) {
				if (touchtime == 0) {
					touchtime = Date.now();
					point = {
						x: e.pageX,
						y: e.pageY
					};
				} else if (
					Date.now() - touchtime < 500 &&
					Math.abs(e.pageX - point.x) < 50 &&
					Math.abs(e.pageY - point.y) < 50
				) {
					if (viewer.zoomValue == options.zoomValue) {
						viewer.zoom(200);
					} else {
						viewer.resetZoom();
					}
					touchtime = 0;
				} else {
					touchtime = 0;
				}
			},

			onPinch(estart) {
				if (!viewer.loaded) return;
				const touch0 = estart.touches[0];
				const touch1 = estart.touches[1];

				if (!(touch0 && touch1)) {
					return;
				}
				zooming = true;

				const startdist = Math.sqrt(
					Math.pow(touch1.pageX - touch0.pageX, 2) +
						Math.pow(touch1.pageY - touch0.pageY, 2)
				);
				const startZoom = viewer.zoomValue;
				const center = {
					x: (touch1.pageX + touch0.pageX) / 2,
					y: (touch1.pageY + touch0.pageY) / 2
				};

				const moveListener = function(emove) {
					emove.preventDefault();

					const touch0 = emove.touches[0];
					const touch1 = emove.touches[1];
					const newDist = Math.sqrt(
						Math.pow(touch1.pageX - touch0.pageX, 2) +
							Math.pow(touch1.pageY - touch0.pageY, 2)
					);
					const zoomValue = startZoom + (newDist - startdist) / 2;

					viewer.zoom(zoomValue, center);
				};

				var endListener = function() {
					document.removeEventListener("touchmove", moveListener);
					document.removeEventListener("touchend", endListener);
					zooming = false;
				};
				let _e = false;
				if (isPassive()) {
					_e = {
						capture: false,
						passive: false
					};
				}
				document.addEventListener("touchmove", moveListener, _e);
				document.addEventListener("touchend", endListener);
			}
		}).init();

		if (options.refreshOnResize) {
			this._resizeHandler = this.refresh.bind(this);
			window.addEventListener("resize", this._resizeHandler);
		}

		let _e = false;
		if (isPassive()) {
			_e = {
				capture: false,
				passive: false
			};
		}
		container.addEventListener("touchmove", preventDefaultCb, _e);
		container.addEventListener("mousewheel", preventDefaultCb);

		this._close = this.hide.bind(this);
		this.closeBtn.addEventListener("click", this._close);
	},

	zoom(perc, point) {
		const self = this;
		const { maxZoom } = this.options;
		const curPerc = this.zoomValue;
		const curImg = this.currentImg;
		const { containerDim } = this;
		const { imageDim } = this;
		const curLeft = self.ImagePosition.x;
		const curTop = self.ImagePosition.y;

		perc = Math.round(Math.max(100, perc));
		perc = Math.min(maxZoom, perc);

		point = point || {
			x: containerDim.w / 2,
			y: containerDim.h / 2
		};
		self._clearFrames();
		let step = 0;

		function _zoom() {
			step++;
			if (step < 20) {
				self._zoomFrame = requestAnimationFrame(_zoom);
			}

			const tickZoom = easeOutQuart(step, curPerc, perc - curPerc, 20);

			const ratio = tickZoom / curPerc;
			const imgWidth = (imageDim.w * tickZoom) / 100;
			const imgHeight = (imageDim.h * tickZoom) / 100;
			let newLeft = -((point.x - curLeft) * ratio - point.x);
			let newTop = -((point.y - curTop) * ratio - point.y);

			const baseLeft = Math.max((containerDim.w - imgWidth) / 2, 0);
			const baseTop = Math.max((containerDim.h - imgHeight) / 2, 0);
			const baseRight = containerDim.w - baseLeft;
			const baseBottom = containerDim.h - baseTop;

			newLeft = Math.min(newLeft, baseLeft);
			newTop = Math.min(newTop, baseTop);

			if (newLeft + imgWidth < baseRight) {
				newLeft = baseRight - imgWidth;
			}
			if (newTop + imgHeight < baseBottom) {
				newTop = baseBottom - imgHeight;
			}

			const left = newLeft;
			const top = newTop;
			const _ratio = imgWidth / imageDim.w;

			curImg.style.transform = `translate3d(${left}px, ${top}px, 0px ) scale3d(${_ratio}, ${_ratio}, 1)`;

			self.ImagePosition = {
				x: left,
				y: top
			};

			self.zoomValue = tickZoom;
		}
		_zoom();
	},
	_clearFrames() {
		cancelAnimationFrame(this._zoomFrame);
	},
	resetZoom() {
		this.zoom(this.options.zoomValue);
	},

	_calculateDimensions() {
		const self = this;
		const curImg = self.currentImg;
		const { container } = self;

		const imageWidth = self.ImagesOriginal.width;
		const imageHeight = self.ImagesOriginal.height;

		const contWidth = container.getBoundingClientRect().width;
		const contHeight = container.getBoundingClientRect().height;

		self.containerDim = {
			w: contWidth,
			h: contHeight
		};

		let imgWidth;
		let imgHeight;
		let ratio = imageWidth / imageHeight;

		if (imageWidth < contWidth && imageHeight < contHeight) {
			imgWidth = imageWidth;
			imgHeight = imageHeight;
			ratio = 1;
		} else {
			imgWidth =
				(imageWidth > imageHeight && contHeight >= contWidth) ||
				ratio * contHeight > contWidth
					? contWidth
					: ratio * contHeight;
			imgHeight = imgWidth / ratio;
		}

		self.imageDim = {
			w: imgWidth,
			h: imgHeight
		};

		curImg.style.width = `${imgWidth}px`;
		curImg.style.height = `${imgHeight}px`;

		curImg.style.maxWidth = "none";
		curImg.style.maxHeight = "none";

		const left = (contWidth - imgWidth) / 2;
		const top = (contHeight - imgHeight) / 2;

		curImg.style.transform = `translate3d(${left}px, ${top}px, 0px ) scale3d(1, 1, 1)`;

		this.ImagePosition = {
			x: left,
			y: top
		};
	},
	refresh() {
		if (!this.loaded) return;
		this._calculateDimensions();
		this.resetZoom();
	},
	show(image) {
		this.container.style.display = "block";
		if (image) this.load(image);
	},
	hide() {
		this.container.style.display = "none";
	},
	destroy() {
		window.removeEventListener("resize", this._resizeHandler);
		this._imageSlider.destroy();
		this.closeBtn.removeEventListener("click", this._close);
		this.container.parentNode.removeChild(this.container);
		this.closeBtn = null;
		this.container = null;
		this.imageWrap = null;
		this.options = null;
		this._close = null;
		this._imageSlider = null;
		this._resizeHandler = null;
	},
	load(image) {
		const self = this;
		const { container } = this;
		const { imageWrap } = this;
		const beforeImg = imageWrap.querySelector(".image-viewer-large-image");
		if (beforeImg) {
			imageWrap.removeChild(beforeImg);
		}
		const img = document.createElement("img");
		img.classList.add("image-viewer-large-image");
		img.src = image;
		this.currentImg = img;

		this.imageWrap.appendChild(img);

		this.loaded = false;

		container.querySelector(".image-viewer-loader").style.display = "block";
		img.style.display = "none";

		function refreshView() {
			self.loaded = true;
			self.zoomValue = 100;

			img.style.display = "block";
			self.refresh();

			container.querySelector(".image-viewer-loader").style.display =
				"none";
		}
		if (imageLoaded(img)) {
			refreshView();
		} else {
			img.onload = function() {
				self.ImagesOriginal = {
					width: img.width,
					height: img.height
				};
				refreshView();
			};
		}
	}
};

ImageViewer.defaults = {
	zoomValue: 100,
	maxZoom: 500,
	refreshOnResize: true,
	zoomOnMouseWheel: true
};

function Factory(options) {
	let container = null;
	if (document.getElementById("image-viewer-container") === null) {
		const imageViewHtml =
			'<div class="image-viewer-loader"></div><div class="image-viewer-image-view"><div class="image-viewer-image-wrap"></div><div class="image-viewer-close"></div></div>';
		container = document.createElement("div");
		container.id = "image-viewer-container";
		container.innerHTML = imageViewHtml;
		document.body.appendChild(container);
	} else {
		container = document.getElementById("image-viewer-container");
	}
	const viewer = new ImageViewer(container, options);
	viewer._init();
	return viewer;
}

export default Factory;
