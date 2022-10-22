import request from './request.js'

module.exports = {
	checkUpdate() {
		this.checkUpdate()
	},
	// #ifdef APP-PLUS
	// App的检查更新
	checkUpdate() {		
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			// 调api查询是否有版本更新
			request('/version/app/check-update', 'POST', {
				version: widgetInfo.version
			}).then(res => {
				if (res.data.is_has_update) {
					// 有更新
					// 跳转到更新页
					let newVersion = res.data.new_version
					let obj = {
						is_silently: newVersion.is_silently, // 是否静默更新
						url: newVersion.package_url, // 安装包下载地址
						platform: newVersion.os_type, // 安装包平台
						type: newVersion.package_type || 'all', // 安装包类型
						desc: newVersion.desc,
						version: newVersion.version
					}
					uni.setStorageSync('PACKAGE_INFO_KEY', obj)
					uni.navigateTo({
						url: '/pages/appUpgrade/index?local_storage_key=PACKAGE_INFO_KEY'
					})
				}
			})
		})

	},
	// #endif
	// #ifndef APP-PLUS
	// 非App的检查更新
	checkUpdate() {
		const updateManager = uni.getUpdateManager();

		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate);
		});

		updateManager.onUpdateReady(function(res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});

		});

		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
		});
	}
	// #endif
}
