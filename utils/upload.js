import {
	$getStorage
} from "./auth.js";
import config from "@/config/index.js";
module.exports = { 
	async upload (image) {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: config.BASE_URL + '/image',
				filePath: image,
				name: 'image',
				header: {
					Authorization: $getStorage('token')
				},
				success: res => {
					try {
						// 返回的是字符串
						let data = JSON.parse(res.data);
						resolve(data.data.image.url);
					} catch (e) {
						reject(e);
					};
				},
				fail: err => {
					reject(e);
				}
			});
		});
	},
	select (options, callback) {
		let upload = this.upload
		
		uni.chooseImage({
			...options,
			success (res) {	
				let arr = []
				res.tempFilePaths.forEach( path => {
					arr.push(upload(path))
				})
				setTimeout(() => {
					uni.showLoading({
						title: '图片处理中'
					})
				}, 100)

				Promise.all(arr).then( urls => {
					setTimeout(() => {
						uni.hideLoading()
					}, 100)

					callback(urls)

				})
			}
		})
	}
}