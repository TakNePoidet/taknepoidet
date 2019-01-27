import './style.scss'

import TouchEvent from './event'
import isPassive from './isPassive'

const ZOOM_CONSTANT = 15
const MOUSE_WHEEL_COUNT = 5

const preventDefaultCb = e => e.preventDefault()
function easeOutQuart(t, b, c, d) {
	t /= d
	t--
	return -c * (t * t * t * t - 1) + b
}

;(function() {
	var lastTime = 0
	if (window.requestAnimationFrame) {
		return
	}
	var vendors = ['ms', 'moz', 'webkit', 'o']
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame =
			window[vendors[x] + 'RequestAnimationFrame']
		window.cancelAnimationFrame =
			window[vendors[x] + 'CancelAnimationFrame'] ||
			window[vendors[x] + 'CancelRequestAnimationFrame']
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback) {
			var currTime = new Date().getTime()
			var timeToCall = Math.max(0, 16 - (currTime - lastTime))
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall)
			}, timeToCall)
			lastTime = currTime + timeToCall
			return id
		}

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id)
		}
})()

/**
 * function to check if image is loaded
 * @param {Node} img en image node
 */
function imageLoaded(img) {
	return (
		img.compvare &&
		(typeof img.naturalWidth === 'undefined' || img.naturalWidth !== 0)
	)
}

function ImageViewer(container, options) {
	this.container = container
	this.options = Object.assign({}, ImageViewer.defaults, options)

	this.zoomValue = 100

	container.classList.add('image-viewer-container')

	this.imageWrap = container.querySelector('.image-viewer-image-wrap')
	this.closeBtn = container.querySelector('.image-viewer-close')
	this.ImagesOriginal = {}
	this.ImagePosition = {
		x: 0,
		y: 0
	}
}

ImageViewer.prototype = {
	constructor: ImageViewer,
	_init() {
		var viewer = this
		var options = viewer.options
		var zooming = false
		var container = viewer.container

		var closeSwipe = {}
		var imageWrap = viewer.imageWrap

		var changedDelta = 0

		var touchtime = 0,
			point

		viewer._imageSlider = new TouchEvent(imageWrap, {
			onStart() {
				if (!viewer.loaded) return false
				if (zooming) return
				var self = this
				self.imgWidth = (viewer.imageDim.w * viewer.zoomValue) / 100
				self.imgHeight = (viewer.imageDim.h * viewer.zoomValue) / 100

				self.curImgLeft = parseFloat(viewer.ImagePosition.x)
				self.curImgTop = parseFloat(viewer.ImagePosition.y)

				closeSwipe = {
					left: self.curImgLeft,
					top: self.curImgTop,

					end: {
						left: self.curImgLeft,
						top: self.curImgTop
					}
				}
			},
			onMove(e, position) {
				if (zooming) return

				this.currentPos = position
				var newLeft = this.curImgLeft + position.dx
				var newTop = this.curImgTop + position.dy
				var baseLeft = Math.max(
						(viewer.containerDim.w - this.imgWidth) / 2,
						0
					),
					baseTop = Math.max(
						(viewer.containerDim.h - this.imgHeight) / 2,
						0
					),
					baseRight = viewer.containerDim.w - baseLeft,
					baseBottom = viewer.containerDim.h - baseTop

				newLeft = Math.min(newLeft, baseLeft)
				newTop = Math.min(newTop, baseTop)

				if (viewer.zoomValue !== 100) {
					if (newLeft + this.imgWidth < baseRight) {
						newLeft = baseRight - this.imgWidth
					}
					if (newTop + this.imgHeight < baseBottom) {
						newTop = baseBottom - this.imgHeight
					}
				} else {
					newLeft = baseRight - this.imgWidth
					newTop = this.curImgTop + position.dy

					let close = Math.abs(newTop - closeSwipe.top)
					if (close < 200) {
						container.style.background = `rgba(0,0,0,${1 -
							(close * 100) / 200 / 100})`

						viewer.currentImg.style.opacity =
							1 - (close * 100) / 200 / 100
					}
				}

				let left = newLeft
				let top = newTop

				let _ratio = this.imgWidth / viewer.imageDim.w
				viewer.currentImg.style.transform = `translate3d(${left}px, ${top}px, 0px ) scale3d(${_ratio}, ${_ratio}, 1)`
				viewer.ImagePosition = {
					x: left,
					y: top
				}

				closeSwipe.end = {
					left: left,
					top: top
				}
			},
			onEnd(e) {
				if (zooming) return

				if (viewer.zoomValue !== 100) return

				if (Math.abs(closeSwipe.end.top - closeSwipe.top) < 200) {
					let _ratio = this.imgWidth / viewer.imageDim.w
					viewer.currentImg.style.transform = `translate3d(${
						closeSwipe.left
					}px, ${
						closeSwipe.top
					}px, 0px ) scale3d(${_ratio}, ${_ratio}, 1)`
					viewer.ImagePosition = {
						x: closeSwipe.left,
						y: closeSwipe.top
					}
					closeSwipe = {}
					container.style.background = `rgb(0,0,0)`
					viewer.currentImg.style.opacity = 1
				} else {
					closeSwipe = {}
					container.style.background = `rgb(0,0,0)`
					viewer.currentImg.style.opacity = 1
					viewer._close()
				}
			},
			onMouseWheel(e) {
				if (!options.zoomOnMouseWheel || !viewer.loaded) {
					return
				}

				var delta = Math.max(-1, Math.min(1, e.wheelDelta)),
					zoomValue =
						(viewer.zoomValue * (100 + delta * ZOOM_CONSTANT)) / 100

				if (!(zoomValue >= 100 && zoomValue <= options.maxZoom)) {
					changedDelta += Math.abs(delta)
				} else {
					changedDelta = 0
				}

				if (changedDelta > MOUSE_WHEEL_COUNT) return

				e.preventDefault()

				var x = e.pageX,
					y = e.pageY

				viewer.zoom(zoomValue, {
					x: x,
					y: y
				})
			},

			onClick(e) {
				if (touchtime == 0) {
					touchtime = Date.now()
					point = {
						x: e.pageX,
						y: e.pageY
					}
				} else {
					if (
						Date.now() - touchtime < 500 &&
						Math.abs(e.pageX - point.x) < 50 &&
						Math.abs(e.pageY - point.y) < 50
					) {
						if (viewer.zoomValue == options.zoomValue) {
							viewer.zoom(200)
						} else {
							viewer.resetZoom()
						}
						touchtime = 0
					} else {
						touchtime = 0
					}
				}
			},

			onPinch(estart) {
				if (!viewer.loaded) return
				var touch0 = estart.touches[0],
					touch1 = estart.touches[1]

				if (!(touch0 && touch1)) {
					return
				}
				zooming = true

				var startdist = Math.sqrt(
						Math.pow(touch1.pageX - touch0.pageX, 2) +
							Math.pow(touch1.pageY - touch0.pageY, 2)
					),
					startZoom = viewer.zoomValue,
					center = {
						x: (touch1.pageX + touch0.pageX) / 2,
						y: (touch1.pageY + touch0.pageY) / 2
					}

				var moveListener = function(emove) {
					emove.preventDefault()

					var touch0 = emove.touches[0],
						touch1 = emove.touches[1],
						newDist = Math.sqrt(
							Math.pow(touch1.pageX - touch0.pageX, 2) +
								Math.pow(touch1.pageY - touch0.pageY, 2)
						),
						zoomValue = startZoom + (newDist - startdist) / 2

					viewer.zoom(zoomValue, center)
				}

				var endListener = function() {
					document.removeEventListener('touchmove', moveListener)
					document.removeEventListener('touchend', endListener)
					zooming = false
				}
				let _e = false
				if (isPassive()) {
					_e = {
						capture: false,
						passive: false
					}
				}
				document.addEventListener('touchmove', moveListener, _e)
				document.addEventListener('touchend', endListener)
			}
		}).init()

		if (options.refreshOnResize) {
			this._resizeHandler = this.refresh.bind(this)
			window.addEventListener('resize', this._resizeHandler)
		}

		let _e = false
		if (isPassive()) {
			_e = {
				capture: false,
				passive: false
			}
		}
		container.addEventListener('touchmove', preventDefaultCb, _e)
		container.addEventListener('mousewheel', preventDefaultCb)

		this._close = this.hide.bind(this)
		this.closeBtn.addEventListener('click', this._close)
	},

	zoom(perc, point) {
		var self = this,
			maxZoom = this.options.maxZoom,
			curPerc = this.zoomValue,
			curImg = this.currentImg,
			containerDim = this.containerDim,
			imageDim = this.imageDim,
			curLeft = self.ImagePosition.x,
			curTop = self.ImagePosition.y

		perc = Math.round(Math.max(100, perc))
		perc = Math.min(maxZoom, perc)

		point = point || {
			x: containerDim.w / 2,
			y: containerDim.h / 2
		}
		self._clearFrames()
		var step = 0

		function _zoom() {
			step++
			if (step < 20) {
				self._zoomFrame = requestAnimationFrame(_zoom)
			}

			var tickZoom = easeOutQuart(step, curPerc, perc - curPerc, 20)

			var ratio = tickZoom / curPerc,
				imgWidth = (imageDim.w * tickZoom) / 100,
				imgHeight = (imageDim.h * tickZoom) / 100,
				newLeft = -((point.x - curLeft) * ratio - point.x),
				newTop = -((point.y - curTop) * ratio - point.y)

			var baseLeft = Math.max((containerDim.w - imgWidth) / 2, 0),
				baseTop = Math.max((containerDim.h - imgHeight) / 2, 0),
				baseRight = containerDim.w - baseLeft,
				baseBottom = containerDim.h - baseTop

			newLeft = Math.min(newLeft, baseLeft)
			newTop = Math.min(newTop, baseTop)

			if (newLeft + imgWidth < baseRight) {
				newLeft = baseRight - imgWidth
			}
			if (newTop + imgHeight < baseBottom) {
				newTop = baseBottom - imgHeight
			}

			let left = newLeft
			let top = newTop
			let _ratio = imgWidth / imageDim.w

			curImg.style.transform = `translate3d(${left}px, ${top}px, 0px ) scale3d(${_ratio}, ${_ratio}, 1)`

			self.ImagePosition = {
				x: left,
				y: top
			}

			self.zoomValue = tickZoom
		}
		_zoom()
	},
	_clearFrames() {
		cancelAnimationFrame(this._zoomFrame)
	},
	resetZoom() {
		this.zoom(this.options.zoomValue)
	},

	_calculateDimensions() {
		var self = this
		var curImg = self.currentImg
		var container = self.container

		var imageWidth = self.ImagesOriginal.width
		var imageHeight = self.ImagesOriginal.height

		var contWidth = container.getBoundingClientRect().width
		var contHeight = container.getBoundingClientRect().height

		self.containerDim = {
			w: contWidth,
			h: contHeight
		}

		var imgWidth, imgHeight
		var ratio = imageWidth / imageHeight

		if (imageWidth < contWidth && imageHeight < contHeight) {
			imgWidth = imageWidth
			imgHeight = imageHeight
			ratio = 1
		} else {
			imgWidth =
				(imageWidth > imageHeight && contHeight >= contWidth) ||
				ratio * contHeight > contWidth
					? contWidth
					: ratio * contHeight
			imgHeight = imgWidth / ratio
		}

		self.imageDim = {
			w: imgWidth,
			h: imgHeight
		}

		curImg.style.width = imgWidth + 'px'
		curImg.style.height = imgHeight + 'px'

		curImg.style.maxWidth = 'none'
		curImg.style.maxHeight = 'none'

		let left = (contWidth - imgWidth) / 2
		let top = (contHeight - imgHeight) / 2

		curImg.style.transform = `translate3d(${left}px, ${top}px, 0px ) scale3d(1, 1, 1)`

		this.ImagePosition = {
			x: left,
			y: top
		}
	},
	refresh() {
		if (!this.loaded) return
		this._calculateDimensions()
		this.resetZoom()
	},
	show(image) {
		this.container.style.display = 'block'
		if (image) this.load(image)
	},
	hide() {
		this.container.style.display = 'none'
	},
	destroy() {
		window.removeEventListener('resize', this._resizeHandler)
		this._imageSlider.destroy()
		this.closeBtn.removeEventListener('click', this._close)
		this.container.parentNode.removeChild(this.container)
		this.closeBtn = null
		this.container = null
		this.imageWrap = null
		this.options = null
		this._close = null
		this._imageSlider = null
		this._resizeHandler = null
	},
	load(image) {
		var self = this
		var container = this.container
		var imageWrap = this.imageWrap
		var beforeImg = imageWrap.querySelector('.image-viewer-large-image')
		if (beforeImg) {
			imageWrap.removeChild(beforeImg)
		}
		var img = document.createElement('img')
		img.classList.add('image-viewer-large-image')
		img.src = image
		this.currentImg = img

		this.imageWrap.appendChild(img)

		this.loaded = false

		container.querySelector('.image-viewer-loader').style.display = 'block'
		img.style.display = 'none'

		function refreshView() {
			self.loaded = true
			self.zoomValue = 100

			img.style.display = 'block'
			self.refresh()

			container.querySelector('.image-viewer-loader').style.display =
				'none'
		}
		if (imageLoaded(img)) {
			refreshView()
		} else {
			img.onload = function() {
				self.ImagesOriginal = {
					width: img.width,
					height: img.height
				}
				refreshView()
			}
		}
	}
}

ImageViewer.defaults = {
	zoomValue: 100,
	maxZoom: 500,
	refreshOnResize: true,
	zoomOnMouseWheel: true
}

function Factory(options) {
	let container = null
	if (document.getElementById('image-viewer-container') === null) {
		var imageViewHtml =
			'<div class="image-viewer-loader"></div><div class="image-viewer-image-view"><div class="image-viewer-image-wrap"></div><div class="image-viewer-close"></div></div>'
		container = document.createElement('div')
		container.id = 'image-viewer-container'
		container.innerHTML = imageViewHtml
		document.body.appendChild(container)
	} else {
		container = document.getElementById('image-viewer-container')
	}
	var viewer = new ImageViewer(container, options)
	viewer._init()
	return viewer
}

export default Factory
