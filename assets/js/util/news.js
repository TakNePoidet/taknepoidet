function getNewsDescription(value) {
	if (!value) return "";

	if (value.length > 100) {
		const rtrim = function rtrim(str, charlist) {
			charlist = charlist.replace(
				/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
				"$1"
			);
			const re = new RegExp(`[${charlist}]+$`, "g");
			return str.replace(re, "");
		};

		value = value.replace("\n", " ");
		const regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm;
		value = value.replace(regex, (...matches) => matches[3]);

		value = value.replace(/<\/?[^>]+>/gi, "");
		value = value.substring(0, 100);
		value = rtrim(value, "!,.-");

		value = value.substring(0, value.lastIndexOf(" "));
		value += "...";
	}

	return value;
}
function getNewsTitlePage(value) {
	if (!value) return "";

	if (value.length > 50) {
		const rtrim = function rtrim(str, charlist) {
			charlist = charlist.replace(
				/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
				"$1"
			);
			const re = new RegExp(`[${charlist}]+$`, "g");
			return str.replace(re, "");
		};

		value = value.replace("\n", " ");
		const regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm;
		value = value.replace(regex, (...matches) => matches[3]);

		value = value.replace(/<\/?[^>]+>/gi, "");
		value = value.substring(0, 50);
		value = rtrim(value, "!,.-");

		value = value.substring(0, value.lastIndexOf(" "));
		value += "...";
	}

	return value;
}

function formatedTextFilter(value) {
	if (!value) return "";

	if (value.length > 0) {
		let regex = /(https?:\/\/|ftp:\/\/|www\.)(((?![.,?!;:()]*(\s|$))[^\s]){2,})/;
		value = value.replace(
			regex,
			(...matches) =>
				`<a target="_blank" href="${matches[0]}">${matches[2]}</a>`
		);

		regex = /\[((id|club)[0-9]*)\|([A-Za-zА-яа-я\s-.]+)\]/gm;
		value = value.replace(
			regex,
			(...matches) =>
				`<a target="_blank" href="https://vk.com/${matches[1]}">${
					matches[3]
				}</a>`
		);
	}

	return value;
}

function formatedText(value) {
	const text = formatedTextFilter(value);
	return text.split("\n");
}

function getRandEmoii() {
	console.log(1);
	const emoji = Object.keys(require("./slug/emoji.json"));
	return emoji
		.sort(() => Math.random() - 0.5)
		.slice(0, 5)
		.join("");
}
export {
	getNewsTitlePage,
	getNewsDescription,
	formatedText,
	formatedTextFilter,
	getRandEmoii
};
