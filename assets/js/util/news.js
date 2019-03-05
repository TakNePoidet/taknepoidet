function getNewsDescription(value) {
	if (!value) return ''

	if (value.length > 100) {
		let rtrim = function rtrim(str, charlist) {
			charlist = charlist.replace(
				/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
				'$1'
			)
			let re = new RegExp('[' + charlist + ']+$', 'g')
			return str.replace(re, '')
		}

		value = value.replace('\n', ' ')
		let regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm
		value = value.replace(regex, (...matches) => {
			return matches[3]
		})

		value = value.replace(/<\/?[^>]+>/gi, '')
		value = value.substring(0, 100)
		value = rtrim(value, '!,.-')

		value = value.substring(0, value.lastIndexOf(' '))
		value += '...'
	}

	return value
}
function getNewsTitlePage(value) {
	if (!value) return ''

	if (value.length > 50) {
		let rtrim = function rtrim(str, charlist) {
			charlist = charlist.replace(
				/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
				'$1'
			)
			let re = new RegExp('[' + charlist + ']+$', 'g')
			return str.replace(re, '')
		}

		value = value.replace('\n', ' ')
		let regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm
		value = value.replace(regex, (...matches) => {
			return matches[3]
		})

		value = value.replace(/<\/?[^>]+>/gi, '')
		value = value.substring(0, 50)
		value = rtrim(value, '!,.-')

		value = value.substring(0, value.lastIndexOf(' '))
		value += '...'
	}

	return value
}

function formatedTextFilter(value) {
	if (!value) return ''

	if (value.length > 0) {
		let regex = /(https?:\/\/|ftp:\/\/|www\.)(((?![.,?!;:()]*(\s|$))[^\s]){2,})/
		value = value.replace(regex, (...matches) => {
			return `<a target="_blank" href="${matches[0]}">${matches[2]}</a>`
		})

		regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm
		value = value.replace(regex, (...matches) => {
			return `<a target="_blank" href="https://vk.com/${matches[1]}">${
				matches[3]
			}</a>`
		})
	}

	return value
}

function formatedText(value) {
	let text = formatedTextFilter(value)
	return text.split('\n')
}

export {
	getNewsTitlePage,
	getNewsDescription,
	formatedText,
	formatedTextFilter
}
