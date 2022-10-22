<template>
	<view class="scope-container" :style="'min-height: 100vh; background: url(' + bgImage + '); background-size: 100% 100%; background-position: center center;'">
		
		abcde
	</view>
</template>

<script>
	
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
		},
		data() {
			return {
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			bgImage ()  {
				return 'https://cdn2.hquesoft.com/box/fudai/bg.png'
			},
		},
		watch: {},
		filters: {
		},
		onLoad(e) {
			this.uuid = e.uuid
		},
		onUnload () {
			
		},
		onPullDownRefresh() {
			this.$showPullRefresh()
			this.initData()
		},
		onShow() {
			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				uni.hideLoading()
			}).catch(res => {
			})
		},
		onReachBottom() {},
		methods: {
			initData() {
				return this.$http(`/jikas/${this.uuid}`, 'GET', {
				}).then(res => {
					this.info = res.data.info
					this.cardList = res.data.info.cards
					this.skus = res.data.info.skus
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.not-found-c {
		font-size: 36rpx;
		// font-weight: 500;
		text-align: center;
		color: white;
		line-height: 500rpx;
	}
	.scope-container {
		// padding-top: 150rpx;
		min-height: 100vh;
		box-sizing: border-box;
		padding-top: 180rpx;
		padding-bottom: 80rpx;
	}
	.content {
		// margin-top: 200rpx;
	}
	.title-image {
		width: 600rpx;
		display: block;
		margin: 0rpx auto;
	}
	
	.rule-btn {
		position: absolute;
		right: 0rpx;
		top:  380rpx;
		width: 100rpx;
		// z-index: 100;
	}
	
	.text-bg {
		background: url('https://cdn2.hquesoft.com/box/jika/text-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		// min-height: 68rpx;
		text-align: center;
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #FFFFFF;
		width: 570rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		margin: 38rpx auto;
	}
	
	.invite-total {
		width: 260rpx;
		text-align: center;
		margin: 0rpx auto;
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #FFFFFF;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.4);
		
		.number {
			color: #FFF710;
			margin: 0rpx 10rpx;
		}
	}
	
	.prize-c {
		// border: 1px solid red;
		// height: 500rpx;
		
	}
	
	.btn-c {
		display: flex;
		align-items: center;
		justify-content: center;
		.pick-btn {
			width: 250rpx;
			// margin: 20rpx auto;
		}
		
		.random-btn {
			width: 250rpx;
			margin-left: 40rpx;
			// height: 106rpx;
			// margin: 20rpx auto 0rpx auto;
		}
	}
	
	
	.remain-times {
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
		// line-height: 100rpx;
		text-align: center;
		// margin-top: 26rpx;
		background: rgba(0, 0, 0, 0.3);
		width: 300rpx;
		margin: 26rpx auto 0rpx auto;
		padding: 6rpx 0rpx;
	}
	
	.card-list-c {
		width: 710rpx;
		// height: 290rpx;
		margin: 30rpx auto;
		// background: url('https://cdn2.hquesoft.com/box/jika/card-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border: 1px solid #01F8FF;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 30rpx;
		// white-space: nowrap;
		position: relative;
		// padding-top: 0rpx;
		
		.scroll-view {
			width: 630rpx;
			position: absolute;
			bottom: 36rpx;
			left: 20rpx;
		}
		
		.top {
			margin: 50rpx 30rpx 50rpx 30rpx;
			display: flex;
			align-items: center;
			.card-title {
				width: 300rpx
			}
		}
		
		.item {
			background: url('https://cdn2.hquesoft.com/box/jika/item-bg.png');
			background-size: 100% auto;
			background-repeat: no-repeat;
			display:inline-block;
			width: 190rpx;
			height: 302rpx;
			text-align: center;
			margin-left: 34rpx;
			position: relative;
			margin-bottom: 20rpx;
			
			&.disabled {
				// filter: grayscale(10%);
				// -webkit-filter: grayscale(10%);
				// -moz-filter: grayscale(10%);
				// -ms-filter: grayscale(10%);
				// -o-filter: grayscale(10%);
				// filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
				// -webkit-filter: grayscale(0.4);
			}
			
			.thumb {
				margin-top: 30rpx;
				width: 130rpx;
				height: 130rpx;
			}
			
			.total {
				font-size: 26rpx;
				font-weight: bold;
				color: #FFFFFF;
				
			}
			
			.title {
				font-size: 26rpx;
				font-weight: bold;
				color: #3876FE;
				position: absolute;
				top: 224rpx;
				width: 100%;
				// line-height: 80rpx;
			}
		}
	}
	
</style>
