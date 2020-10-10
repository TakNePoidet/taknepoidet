// @ts-nocheck
/*!
 * Device 1.0.0
 *
 * Yakin Nikita
 * Copyright 2019, MIT License
 *
 */
// eslint-disable-next-line prettier/prettier
void (function (window, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD

		define([], factory);
	} else if (typeof module === "object" && module.exports) {
		// CommonJS

		module.exports = factory();
	} else {
		// browser global
		window.Device = factory();
	}
})(window, () => {
	function Device() {
		const userAgent = window.navigator.userAgent.toLowerCase();

		const television = [
			"googletv",
			"viera",
			"smarttv",
			"internet.tv",
			"netcast",
			"nettv",
			"appletv",
			"boxee",
			"kylo",
			"roku",
			"dlnadoc",
			"pov_tv",
			"hbbtv",
			"ce-html"
		];
		const changeOrientationList = [];
		function handleOrientation() {
			if (device.getLandscape()) {
				walkOnChangeOrientationList("landscape");
			} else {
				walkOnChangeOrientationList("portrait");
			}
		}
		function walkOnChangeOrientationList(newOrientation) {
			for (const index of changeOrientationList) {
				index(newOrientation);
			}
		}

		function find(needle) {
			return userAgent.indexOf(needle) !== -1;
		}

		let device = {
			getTypeDevice() {
				if (this.isMobile()) {
					return "mobile";
				}
				if (this.isTablet()) {
					return "tablet";
				}
				if (this.isDesktop()) {
					return "desktop";
				}
				if (this.isTelevision()) {
					return "television";
				}
				return undefined;
			},

			getOientation() {
				if (this.getPortrait()) {
					return "portrait";
				}
				if (this.getLandscape()) {
					return "landscape";
				}
				return undefined;
			},
			getDeviceOS() {
				if (this.isIos()) {
					return "ios";
				}
				if (this.isAndroid()) {
					return "android";
				}
				if (this.isBlackberry()) {
					return "blackberry";
				}
				if (this.isMacos()) {
					return "macos";
				}
				if (this.isWindows()) {
					return "windows";
				}
				if (this.isFxos()) {
					return "fxos";
				}
				if (this.isMeego()) {
					return "meego";
				}
				if (this.television()) {
					return "television";
				}
				return undefined;
			},
			isMobile() {
				if (
					this.isAndroidPhone() ||
					this.isIphone() ||
					this.isIpod() ||
					this.isWindowsPhone() ||
					this.isBlackberryPhone() ||
					this.isFxosPhone() ||
					this.isMeego()
				) {
					return true;
				}
				return false;
			},
			isTablet() {
				if (
					this.isIpad() ||
					this.isAndroidTablet() ||
					this.isBlackberryTablet() ||
					this.isWindowsTablet() ||
					this.isFxosTablet()
				) {
					return true;
				}
				return false;
			},

			isDesktop() {
				return !this.isTablet() && !this.isMobile();
			},
			isTelevision() {
				let i = 0;
				while (i < television.length) {
					if (find(television[i])) {
						return true;
					}
					i++;
				}
				return false;
			},

			isMacos() {
				return find("mac");
			},

			isIos() {
				return this.isIphone() || this.isIpod() || this.isIpad();
			},

			isIphone() {
				return !this.isWindows() && find("iphone");
			},

			isIpod() {
				return find("ipod");
			},

			isIpad() {
				return find("ipad");
			},

			isAndroid() {
				return !this.isWindows() && find("android");
			},

			isAndroidPhone() {
				return this.isAndroid() && find("mobile");
			},

			isAndroidTablet() {
				return this.isAndroid() && !find("mobile");
			},

			isBlackberry() {
				return find("blackberry") || find("bb10") || find("rim");
			},

			isBlackberryPhone() {
				return this.isBlackberry() && !find("tablet");
			},

			isBlackberryTablet() {
				return this.isBlackberry() && find("tablet");
			},

			isWindows() {
				return find("windows");
			},

			isWindowsPhone() {
				return this.isWindows() && find("phone");
			},

			isWindowsTablet() {
				return (
					this.isWindows() &&
					(find("touch") && !this.isWindowsPhone())
				);
			},

			isFxos() {
				return (find("mobile") || find("tablet")) && find("rv:");
			},

			isFxosPhone() {
				return this.isFxos() && find("mobile");
			},

			isFxosTablet() {
				return this.isFxos() && find("tablet");
			},

			isMeego() {
				return find("meego");
			},

			getPortrait() {
				if (
					screen.orientation &&
					Object.prototype.hasOwnProperty.call(
						window,
						"onorientationchange"
					)
				) {
					return screen.orientation.type.includes("portrait");
				}
				return window.innerHeight / window.innerWidth > 1;
			},

			getLandscape() {
				if (
					screen.orientation &&
					Object.prototype.hasOwnProperty.call(
						window,
						"onorientationchange"
					)
				) {
					return screen.orientation.type.includes("landscape");
				}
				return window.innerHeight / window.innerWidth < 1;
			},

			onChangeOrientation(cb) {
				if (typeof cb === "function") {
					changeOrientationList.push(cb);
				}
			}
		};

		return device;
	}
	window.Device = Device;
});
