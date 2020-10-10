function genetateMetaTag(key, value) {
	return {
		hid: key,
		name: key,
		content: value
	};
}

function createMetaTag(self, config = {}) {
	const meta = [];
	const defaulttag = {
		viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
		title: "Якин Никита",
		description:
			"Моя личная страница. Зачем?! Потому что я так хочу. ¯_(ツ)_/¯",
		image: {
			src: "/images/cover-site.jpg",
			width: 1200,
			height: 600
		},

		"og:type": "page",
		"og:url": self.$store.state.baseurl
	};
	config = Object.assign(defaulttag, config);
	for (const key in config) {
		const content = config[key];
		if (key === "image") {
			meta.push(genetateMetaTag("og:image", content.src));
			meta.push(genetateMetaTag("og:image:url", content.src));
			meta.push(genetateMetaTag("og:image:secure_url", content.src));
			meta.push(genetateMetaTag("og:image:width", content.width));
			meta.push(genetateMetaTag("g:image:height", content.height));
			continue;
		}
		if (key === "title") {
			meta.push(genetateMetaTag("og:title", content));
			continue;
		}
		if (key === "description") {
			meta.push(genetateMetaTag("description", content));
			meta.push(genetateMetaTag("og:description", content));

			continue;
		}

		meta.push(genetateMetaTag(key, content));
	}
	return meta;
}

function createLinkTag(self, config = {}) {
	const link = [];
	const defaulttag = {
		image_src: "/images/cover-site.jpg",
		canonical: self.$store.state.baseurl
	};
	config = Object.assign(defaulttag, config);
	for (const key in config) {
		const content = config[key];
		if (typeof content === "string") {
			link.push({
				hid: key,
				rel: key,
				href: content
			});
			continue;
		}
	}
	return link;
}

export { createMetaTag, createLinkTag };
