import Vue from 'vue'

module.exports = {
	getStorage(key) {
		try {
			return uni.getStorageSync(key)
		} catch (e) {
			return null
		}
	},
	setStorage(key, data) {
		try {
			uni.setStorageSync(key, data)
		} catch (e) {
			throw new Error("setStorage Error")
		}
	},
	removeStorage(key) {
		uni.removeStorage({
			key: key
		})
	},
	getUrlParam(key) {
		let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i")
		let r = window.location.search.substr(1).match(reg)
		if (r != null) {
			return decodeURIComponent(r[2])
		};
		return null;
	},
	addUrlParam(key, value, uri) {
		uri = uri || window.location.href
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		} else {
			return uri + separator + key + "=" + value;
		}
	},
	isIOS() {
		return uni.getSystemInfoSync().platform === 'ios'
	},
	isAndroid() {
		return uni.getSystemInfoSync().platform === 'android'
	},
	isIOSWeb() {
		return window.__wxjs_is_wkwebview === true
	},
	isPhoneNumber(str) {
		var phoneReg = /^[1]\d{10}$/
		// var phoneReg = /\d{11}/
		return phoneReg.test(str)
	},
	isEmail(str) {
		var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/
		return reg.test(str)
	},
	//纳税人识别号
	isTaxNumber(str) {
		const reg = /^[0-9a-zA-Z]{15,20}$/
		return reg.test(str)
	},
	checkNickName(str) {
		const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-\_]{1,15}$/
		return reg.test(str)
	},
	maskPhone(str) {
		if (null != str && str != undefined) {
			var pat = /(\d{3})\d*(\d{4})/;
			return str.replace(pat, '$1****$2');
		} else {
			return "";
		}
	},
	now(fmt) {
		return this.formatDate(null, fmt)
	},
	formatPrice(price) {
		return (price / 100).toFixed(2)
	},
	formatDate(time, fmt) {
		if (typeof time === 'string') {
			if (time.length === 10) {
				time += ' 00:00:00'
			}
			
			var t = time.split(/[- :]/);

			// Apply each element to the Date function
			var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
			var date = new Date(d)
		} else {
			var date = new Date()
		}

		// let date = new Date(time)
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	},
	showShortTime(time) {
		var t = time.split(/[- :]/);
		// Apply each element to the Date function
		var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])

		const now = new Date()

		let diff = now.getTime() - d.getTime()
		let day = Math.floor(diff / (24 * 3600 * 1000))
		var leave1 = diff % (24 * 3600 * 1000)
		var hour = Math.floor(leave1 / (3600 * 1000))
		var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
		var minute = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数

		if (day > 4) {
			return this.formatDate(time, 'yyyy/MM/dd hh:mm')
		} else if (day > 0) {
			return `${day}天${hour}小时前`
		} else if (hour > 0) {
			return `${hour}小时前`
		} else if (minute > 4) {
			return `${minute}分钟前`
		} else {
			return '刚刚'
		}
	},
	scrollToTop() {
		window.scrollTo(0, 0)
	},
	previewImage(urls, index) {
		index = index || 0
		if (typeof urls == 'string') {
			urls = [urls]
		}

		uni.previewImage({
			urls: urls,
			current: index
		})
	},
	copyText(text, tips) {
		tips = tips || '复制成功'
		uni.setClipboardData({
			data: text,
			success: () => {
				uni.showToast({
					title: tips,
					icon: 'none'
				})
			}
		})
	},
	devTips() {
		uni.showToast({
			title: '此页面开发中',
			icon: 'none'
		})
	},
	toPage(url) {
		uni.navigateTo({
			url: url
		})
	}
}
