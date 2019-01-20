/*!
 * SwipeSlider 1.0.0
 *
 * Yakin Nikita
 * Copyright 2019, MIT License
 *
 */
void (function(window, factory) {
	if (typeof define == 'function' && define.amd) {
		// AMD

		define([], factory)
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS

		module.exports = factory()
	} else {
		// browser global
		window.SwipeSlider = factory()
	}
})(window, function() {
	function SwipeSlider(container, options) {
		'use strict'

		options = options || {}

		if (!container) return

		let element = container.querySelector('.swipe-panel')

		let slides,
			interval,
			slidesCount = 0,
			widthContainer,
			translateX = 0,
			delta = {},
			locked = false,
			disabled = false,
			startDrag = {},
			infinite = !(options.infinite === false),
			// infinite = false,
			autoplay = options.autoplay || false,
			autoplaySpeed = parseInt(options.autoplaySpeed, 10) || 2000,
			speed = parseInt(options.speed, 10) || 300,
			transition = isNaN(parseInt(options.transition, 10))
				? 400
				: parseInt(options.transition, 10),
			currentSlide = parseInt(options.startSlide, 10) || 0,
			centerMode = options.centerMode || false,
			slidesToScroll = parseInt(options.slidesToScroll, 10) || 1,
			slidesToShow = parseInt(options.slidesToShow, 10) || 1,
			slideWidth = parseInt(options.slideWidth, 10) || null,
			dots = options.dots || false,
			oldSlide = currentSlide

		const events = {
			handleEvent(event) {
				// event.preventDefault()
				if (disabled) return
				switch (event.type) {
					case 'mousedown':
					case 'touchstart':
						this.start(event)
						break
					case 'mousemove':
					case 'touchmove':
						this.move(event)
						break
					case 'mouseup':
					case 'mouseleave':
					case 'touchend':
						this.end(event)
						break
					case 'resize':
						this.resize()
						break
				}

				if (options.stopPropagation) {
					event.stopPropagation()
				}
			},

			start(event) {
				// event.preventDefault()

				let touches
				locked = true

				if (isMouseEvent(event)) {
					touches = event
					event.preventDefault() // For desktop Safari drag
				} else {
					touches = event.touches[0]
				}

				startDrag = {
					// get initial touch coords
					x: touches.pageX,
					y: touches.pageY,

					time: +new Date()
				}

				delta = {}
			},

			move(event) {
				// event.preventDefault()
				if (!locked) return false

				let touches

				if (isMouseEvent(event)) {
					touches = event
				} else {
					// ensure swiping with one touch and not pinching
					if (
						event.touches.length > 1 ||
						(event.scale && event.scale !== 1)
					) {
						return
					}

					if (options.disableScroll) {
						event.preventDefault()
					}

					touches = event.touches[0]
				}

				// measure change in x and y
				delta = {
					x: touches.pageX - startDrag.x,
					y: touches.pageY - startDrag.y
				}
				let x = translateX + delta.x

				if (!infinite) {
					if (delta.x < 0 && currentSlide === slidesCount - 1) {
						return false
					}
				}
				element.style.transform = `translate3d(${x}px, 0px, 0px)`
			},

			end(event) {
				if (!locked) return false

				let isValidSlide =
					(Number(duration) < 20 && Math.abs(delta.x) > 20) ||
					Math.abs(delta.x) > 20
				let duration = +new Date() - startDrag.time

				if (isValidSlide) {
					let direction = Math.abs(delta.x) / delta.x
					if (direction < 0) {
						_nextSlide()
					} else {
						_prewSlide()
					}
				} else {
					_AnimateToSlide(currentSlide, 0)
				}
				locked = false
				// delta = {}
			},

			resize() {
				_destroy()
				_setup()
			}
		}
		/*
		 * Приватный метод. Инициалиция слайдера
		 *
		 */
		function _setup() {
			widthContainer = container.getBoundingClientRect().width
			let slides = [].slice.call(element.children)
			let length = slides.length
			slidesCount = length

			// Минус клоны
			for (let i = 0; i < slides.length; i++) {
				if (slides[i].getAttribute('data-cloned')) length--
			}

			if (slides.length < 2) {
				infinite = false
			}

			slides.forEach(slide => slide.setAttribute('data-cloned', false))

			if (infinite) {
				let j = 0
				for (let i = 0; i < slidesToShow + slidesToScroll; i++) {
					let keyBefore = length - j - 1,
						keyAppent = j
					cloneInsertBefore(slides[keyBefore], keyBefore)
					cloneInsertAppent(slides[keyAppent], keyAppent)
					j++
					if (j > slidesCount - 1) j = 0
				}
			}

			slides = element.children

			let track = 0
			widthContainer = container.getBoundingClientRect().width
			for (let i = 0; i < element.children.length; i++) {
				let width
				if (slideWidth) {
					width = slideWidth
				} else {
					width = widthContainer / slidesToShow
				}
				// let { width } = slides[0].getBoundingClientRect()

				element.children[i].style.width = `${width}px`
				element.children[i].setAttribute(
					'data-index',
					infinite ? i - slidesToShow - slidesToScroll : i
				)
				track += width
			}
			element.style.width = `${track}px`

			if (dots && slidesCount > 1) {
				container.classList.add('swipe-this-dot')
				let dots_count = Math.ceil(slidesCount / slidesToScroll)
				if (!container.querySelector('.slider-controls')) {
					let controls = document.createElement('ul')
					controls.classList.add('slider-controls')
					for (let i = 0; i < dots_count; i++) {
						let li = document.createElement('li')
						let button = document.createElement('button')
						button.type = 'button'
						button.innerHTML = i * slidesToShow + 1
						button.setAttribute('data-index', i)
						// button.dataset['index'] = i
						button.addEventListener('click', _setSlideDots)
						button.addEventListener('touchstart', _setSlideDots)

						li.appendChild(button)
						controls.appendChild(li)
					}

					container.appendChild(controls)
				}
			}
			detachEvents()
			attachEvents()
			_setSlide(currentSlide)
			container.style.visibility = 'visible'
		}

		/*
		 * Публичный метод. Инициалиция слайдера
		 *
		 */
		function setup() {
			_setup()
		}
		/*
		 * Приватный метод. Уничтожение слайдера
		 *
		 */
		function _destroy() {
			_stop()
			detachEvents()

			if (container.querySelector('.slider-controls')) {
				container.classList.remove('swipe-this-dot')
				container.querySelector('.slider-controls').remove()
			}

			slides = element.children
			for (let i = 0; i < element.children.length; i++) {
				element.children[i].style.width = ``
				element.children[i].removeAttribute('data-index')
				element.children[i].classList.remove('slide-active')
			}
			element.style.width = ``
			element.style.transform = ``

			let _a = [].slice
				.call(container.querySelectorAll('[data-cloned=true]'))
				.forEach(e => e.remove())
			_a = [].slice
				.call(container.querySelectorAll('[data-cloned]'))
				.forEach(e => e.removeAttribute('data-cloned'))
		}

		/*
		 * Публичный метод. Уничтожение слайдера
		 *
		 */

		function destroy() {
			_destroy()
		}

		function cloneInsertBefore(el, key) {
			let clone = el.cloneNode(true)
			element.insertBefore(clone, element.firstChild)
			clone.setAttribute('data-cloned', true)
			clone.setAttribute('data-slide-original', key)
			clone.removeAttribute('id')
		}
		function cloneInsertAppent(el, key) {
			let clone = el.cloneNode(true)
			element.appendChild(clone)
			clone.setAttribute('data-cloned', true)
			clone.setAttribute('data-slide-original', key)
			clone.removeAttribute('id')
		}
		function attachEvents() {
			element.addEventListener('mousedown', events, false)
			element.addEventListener('touchstart', events, false)

			element.addEventListener('mousemove', events, false)
			element.addEventListener('touchmove', events, false)

			window.addEventListener('mouseup', events, false)
			window.addEventListener('touchend', events, false)

			window.addEventListener('resize', events, false)

			let _a = [].slice
				.call(container.querySelectorAll('a'))
				.forEach(e => e.addEventListener('click', eventsLink))

			if (dots) {
				if (container.querySelector('.slider-controls')) {
					let _a = [].slice
						.call(
							container.querySelectorAll(
								'.slider-controls button'
							)
						)
						.forEach(button => {
							button.addEventListener('click', _setSlideDots)
							button.addEventListener('touchstart', _setSlideDots)
						})
				}
			}
		}
		function detachEvents() {
			element.removeEventListener('mousedown', events, false)
			element.removeEventListener('touchstart', events, false)

			element.removeEventListener('mousemove', events, false)
			element.removeEventListener('touchmove', events, false)

			window.removeEventListener('mouseup', events, false)
			window.removeEventListener('touchend', events, false)

			window.removeEventListener('resize', events, false)

			let _a = [].slice
				.call(container.querySelectorAll('a'))
				.forEach(e => e.removeEventListener('click', eventsLink))

			if (dots) {
				if (container.querySelector('.slider-controls')) {
					let _a = [].slice
						.call(
							container.querySelectorAll(
								'.slider-controls button'
							)
						)
						.forEach(button => {
							button.removeEventListener('click', _setSlideDots)
							button.removeEventListener(
								'touchstart',
								_setSlideDots
							)
						})
				}
			}
		}

		/*
		 * Приватный метод. Методы для клика по ссылке
		 *
		 */
		function eventsLink(e) {
			if (
				Object.keys(delta).length > 0 &&
				(delta.x !== 0 || delta.y !== 0)
			) {
				e.preventDefault()
			}
		}

		function isMouseEvent(e) {
			return /^mouse/.test(e.type)
		}
		/*
		 * Приватный метод. Перемотка следующий слайд
		 *
		 */
		function _nextSlide() {
			_stop()
			let direction = slidesToScroll
			// index слайда
			let index = currentSlide + slidesToScroll
			if (slidesCount - 1 < index) {
				if (infinite) {
					// 1 слайд, если слайдов больше index
					index = 0
					direction = slidesCount - currentSlide
				} else {
					// Последний слайд, если слайдов больше index
					index = slidesCount - 1
					direction = 0
				}
			} else {
				if (!infinite) {
					if (slidesCount - 1 < index - slidesToScroll) {
						index = slidesCount - slidesToScroll - 1
						direction = 0
					}
					if (slidesCount - 1 < index) {
						index = slidesCount - 1
					}
				}
			}
			// Анимация
			_AnimateToSlide(index, direction)
		}
		/*
		 * Публичный метод. Перемотка следующий слайд
		 *
		 */
		function nextSlide() {
			_nextSlide()
		}
		/*
		 * Приватный метод. Перемотка предыдущий слайд
		 *
		 */
		function _prewSlide() {
			_stop()
			let direction = slidesToScroll
			// index слайда
			let index = currentSlide - slidesToScroll
			if (index < 0) {
				if (infinite) {
					// Последний слайд, если слайдов больше index
					index = Math.abs(slidesCount - 1)
				} else {
					// 1 слайд, если слайдов больше index
					index = 0
					direction = currentSlide
				}
			}
			// Анимация
			_AnimateToSlide(index, -direction)
		}
		/*
		 * Публичный метод. Перемотка предыдущий слайд
		 *
		 */
		function prewSlide() {
			_prewSlide()
		}
		function _AnimateToSlide(index, direction) {
			let slideActive = element.querySelector(
				'.slide-active[data-cloned=false]'
			)

			let sIndex = parseInt(slideActive.getAttribute('data-index'))
			sIndex = sIndex + direction
			if (!infinite) {
				if (slidesCount - 1 <= sIndex && slidesToShow > 1) {
					sIndex = slidesCount - slidesToShow
				}
				if (slidesToShow > 1 && sIndex === 0) {
					sIndex = 0
				}
			} else {
				if (sIndex === slidesCount - 1) {
					sIndex = slidesCount - slidesToShow
				}
			}

			let next = element.querySelector(`[data-index="${sIndex}"]`)
			let { width, left } = next.getBoundingClientRect()
			translateX = left - element.getBoundingClientRect().left
			translateX = translateX * -1

			if (centerMode) {
				let centerOffset = (widthContainer - width * slidesToShow) / 2
				translateX += centerOffset
			}
			element.style.transform = `translate3d(${translateX}px, 0px, 0px)`

			if (transition > 0) {
				element.style.transition = `transform ${transition}ms`
			}
			setTimeout(() => {
				element.style.transition = `transform ${0}ms`
				_setSlide(index)
			}, transition + 25)
		}

		/*
		 * Приватный метод. Установка слайда
		 *
		 * index - индекс слайда
		 */
		function _setSlide(index) {
			// Не клонированные слайды
			let slide_not_clone = [].slice.call(element.children).filter(el => {
				return el.getAttribute('data-cloned') === 'false'
			})
			// Слайд, который надо установить
			if (!infinite) {
				if (slidesCount - 1 == index && slidesToShow > 1) {
					index = slidesCount - slidesToShow
				}
			}
			let slide = element.querySelector(`[data-index="${index}"]`)
			// Ширина слайдера
			let { width } = slide_not_clone[index].getBoundingClientRect()

			if (infinite) {
				let _index = index

				if (_index >= slidesCount - 1) {
					_index = slidesCount - slidesToShow
				}
				translateX =
					width * (slidesToShow + slidesToScroll + _index) * -1
			} else {
				let _index = index

				if (_index >= slidesCount - 1) {
					_index = slidesCount - slidesToShow
				}
				translateX = width * _index * -1
				// console.log
				if (index >= slidesCount - 1) {
					// widthContainer = container.getBoundingClientRect().width
					// translateX = translateX + widthContainer / 2
				}
			}

			// Центрируем, (контейнер - ширина слайдера) / 2
			if (centerMode) {
				let centerOffset = (widthContainer - width * slidesToShow) / 2
				translateX += centerOffset
			}

			// Перемещаем панель со слайдами
			element.style.transform = `translate3d(${translateX}px, 0px, 0px)`

			// Удаляем классы
			for (let i = 0; i < element.children.length; i++) {
				element.children[i].classList.remove('slide-active')
			}
			for (let i = 0; i < slide_not_clone.length; i++) {
				slide_not_clone[i].classList.remove('slide-active')
				// slide_not_clone[i].classList.remove('slide-active')
			}

			if (container.querySelector('.slider-controls')) {
				for (
					let i = 0;
					i <
					container.querySelector('.slider-controls').children.length;
					i++
				) {
					container
						.querySelector(`.slider-controls [data-index="${i}"]`)
						.classList.remove('active')
				}
			}
			// Присваеваем класс
			for (let i = 0; i < slidesToShow; i++) {
				if (infinite) {
					element
						.querySelector(`[data-index="${index + i}"]`)
						.classList.add('slide-active')
					if (
						element.querySelector(
							`[data-slide-original="${index + i}"]`
						)
					) {
						element
							.querySelector(
								`[data-slide-original="${index + i}"]`
							)
							.classList.add('slide-active')
					}
				} else {
					let j = index + i
					if (j >= slidesCount - 1) j = slidesCount - 1
					element
						.querySelector(`[data-index="${j}"]`)
						.classList.add('slide-active')
				}

				if (
					container.querySelector('.slider-controls') &&
					slidesCount > 1
				) {
					let j = index + i
					if (j > slidesCount - 1)
						j = slidesCount - (slidesCount - 1) - 1
					// container.querySelector(`.slider-controls [data-index="${j}"]`).classList.add('active')
				}
			}
			let _controls_index = index
			if (slidesToScroll > 1) {
				_controls_index = Math.ceil(
					index / Math.ceil(slidesCount / slidesToScroll)
				)
			}
			if (
				container.querySelector('.slider-controls') &&
				slidesCount > 1
			) {
				container
					.querySelector(
						`.slider-controls [data-index="${_controls_index}"]`
					)
					.classList.add('active')
			}
			// Установка переменных
			oldSlide = index
			currentSlide = index
			container.setAttribute('data-slide-active', currentSlide + 1)
			_start()
		}
		/*
		 * Приватный метод. Перемотка на № слайдер
		 *
		 * slide - № слайда
		 */
		function _slideTo(slide) {
			_stop()

			let _slidesCount = Math.ceil(slidesCount / slidesToScroll)
			// Math.ceil(slidesCount / slidesToShow) * (slide - 1)

			// console.log(slide, _slidesCount, slidesCount, slidesCount - _slidesCount)
			// console.log(
			// Если слайдов больше, выходим
			if (slide > _slidesCount) return false
			// Если не текущий слайд
			if (slide - 1 !== currentSlide) {
				// Направление
				slide = (slide - 1) * slidesToScroll
				let direction = slide - currentSlide
				_AnimateToSlide(slide, direction)
			}
		}
		/*
		 * Приватный метод. Перемотка на № слайдер через точки
		 *
		 */
		function _setSlideDots(event) {
			_stop()
			event.preventDefault()
			let slide = parseInt(event.currentTarget.getAttribute('data-index'))
			if (!isNaN(slide)) _slideTo(slide + 1)
		}

		/*
		 * Публичный метод. Перемотка на № слайдер
		 *
		 * slide - № слайда
		 */
		function slideTo(slide) {
			_slideTo(slide)
		}

		/*
		 * Приватный метод. Запуск слайдера
		 *
		 */
		function _start() {
			interval = clearInterval(interval)
			if (autoplay) {
				interval = setInterval(_nextSlide, autoplaySpeed)
			}
		}

		/*
		 * Публичный метод. Запуск слайдера
		 *
		 */
		function start() {
			_start()
		}

		/*
		 * Приватный метод. Остановка слайдера
		 *
		 */
		function _stop() {
			interval = clearInterval(interval)
		}

		/*
		 * Публичный метод. Остановка слайдера
		 *
		 */
		function stop() {
			_stop()
		}

		/*
		 * Приватный метод. Возвращение функций API
		 *
		 */
		function _getAPI() {
			return {
				nextSlide,
				prewSlide,
				slideTo,
				destroy,
				start,
				stop,
				setup,

				getCurentSlide() {
					return currentSlide
				}
			}
		}

		_setup()

		return _getAPI()
	}
	return SwipeSlider
})
