<script>
	import {
		$setStorage
	} from "@/utils/auth.js";
	
	import {
		BASE_URL
	} from "@/config/index.js";
	
	import updateCli from "@/utils/updateCli.js"
	
	// #ifdef H5
	import $wechatJsTool from "@/utils/wechat.js"
	// #endif

	export default {
		onLaunch: function(e) {
			this.$store.dispatch("setEnterScene", e.scene)

			// 淘宝小程序自动登陆
			// #ifdef MP-ALIPAY
			my.authorize({
				scopes: 'scope.userInfo',
				success: (res) => {
					my.getAuthUserInfo({
						success: (userInfo) => {
							// console.log('userInfo ==========>', userInfo)
							
							return this.$store.dispatch("login", {
								type: 'with-taobao',
								params: {
									name: userInfo.nickName,
									headimg: userInfo.avatar,
								}
							})
						}
					})
				},
			});
			// #endif

			// 检查是否有邀请人参数
			if (e.query && e.query.inviter) {
				// console.log('inviter', e.query.inviter)
				$setStorage('inviter', e.query.inviter)
				$setStorage('invite_node', e.query.invite_node)
			}
			
			// #ifdef APP-PLUS
			// App版检查是否安装有openinstall，并查找安装参数（邀请码等）
			// if (process.env.NODE_ENV !== 'development') {
			// 	const openinstall = uni.requireNativePlugin('openinstall-plugin');
			// 	openinstall.init();
			// 	openinstall.getInstall(
			// 	    8,
			// 	    function (result) {
			// 			let bindData = JSON.parse(result.bindData || '{}')
						
			// 			// App安装参数带有inviter字段
			// 			if (bindData.inviter) {
			// 				$setStorage('inviter', bindData.inviter)
			// 				$setStorage('invite_node', bindData.invite_node)
			// 			}
			// 	    }
			// 	);
			// }
			// #endif

			// 获取基本设置
			this.$store.dispatch("getSetting")
			
			// 部分安卓机型需要隔500毫秒重发
			setTimeout(() => {
				this.$store.dispatch("getSetting")
			}, 500)
			
			// 检查更新
			setTimeout(() => {
				updateCli.checkUpdate()
			}, 2000)
			
			// #ifdef H5
			// 初始化微信js
			$wechatJsTool.initJSSdk()
			// #endif
			
			// // #ifdef APP
			// 	plus.navigator.closeSplashscreen();
				
			// 	// app启动时打开启动广告页
			// 	var w = plus.webview.open(BASE_URL + '/AppLaunchPage/advertise/advertise.html', '本地地址',
			// 	{ top: 0, bottom: 0, zindex: 999 }, 'fade-in', 5);
				
			// 	//设置定时器，8s后关闭启动广告页
			// 	setTimeout(function() {
			// 		plus.webview.close(w);
			// 	}, 8000);
			// // #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import url("./common/html.css");
	@import "./common/iconfont.css";
	@import "./common/new-iconfont.css";
	@import "./common/common.css";
	@import './common/animate.css';
	@import './common/app.scss';

	.float-icon-animate {
		animation: float-icon-animate 1s;
		animation-iteration-count: infinite;
		transform-origin: center;
	}

	@keyframes float-icon-animate {
		0% {
			transform: scale(1) rotate(-4deg);
		}

		25% {
			transform: rotate(0deg);
		}

		50% {
			transform: scale(1.1) rotate(4deg);
		}

		75% {
			transform: rotate(0deg);
		}

		100% {
			transform: scale(1) rotate(-4deg);
		}
	}

	.hover {
		opacity: 0.8;
	}

	page {
		background-color: #fff;
		color: #333333;
		font-size: 30rpx;
	}
</style>
