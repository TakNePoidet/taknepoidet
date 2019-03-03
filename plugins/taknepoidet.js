import Vue from 'vue'
import anime from 'animejs'
// import ImageViewer from './imageViewer'
// import '@babel/polyfill'
if (process.browser) {
	// window.addEventListener('load', () => {
	console.log(
		'%c%s',
		[
			'padding: 0px;',
			'color: transparent;',
			'font-size: 150px;',
			'line-height: 250px',
			'width: 250px;',
			'height: 250px;',
			'display: block;',
			`background: url('${location.protocol}://${
				location.host
			}/images/nyan2.gif') no-repeat;`,
			'background-size: contain;'
		].join(''),
		'Привет'
	)
	// });
}

if (process.browser) {
	// const WOW = require('wow.js')
	import('wow.js').then(Response => {
		// console.log(WOW)
		let WOW = Response.default
		let wow = new WOW({
			boxClass: 'wow', // animated element css class (default is wow)
			animateClass: 'animated', // animation css class (default is animated)
			offset: 50, // distance to the element when triggering the animation (default is 0)
			mobile: false, // trigger animations on mobile devices (default is true)
			live: true, // act on asynchronously loaded content (default is true)
			scrollContainer: null // optional scroll container selector, otherwise use window
		})
		wow.init()
	})

	const svgPath = document.querySelectorAll('#websiteClip')

	const svgText = anime({
		targets: svgPath,
		loop: true,
		direction: 'alternate',
		strokeDashoffset: [anime.setDashoffset, 0],
		easing: 'easeInOutSine',
		duration: 700,
		delay: (el, i) => {
			return i * 500
		}
	})
}

import VueScrollTo from 'vue-scrollto'
Vue.use(VueScrollTo, {
	container: 'body',
	duration: 500,
	easing: 'ease',
	offset: -115,
	force: true,
	cancelable: true,
	onStart: false,
	onDone: function(e) {},
	onCancel: false,
	x: false,
	y: true
})
