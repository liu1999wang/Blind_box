<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content" @tap.stop v-if="isInit && !isReturnSaleSuccess">
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">使用积分兑换次数</view>
			
			<view class="money-c">
				
				<view class="input-c">
					兑换<input class="input score-input" v-model.number="total"></input>次
				</view>
				
				<view>
					{{scorePrice}}{{scoreAlias}}/次，总计<span class="total">{{scorePrice * total}}</span>{{scoreAlias}}
				</view>
				
			</view>

			<view class="btn-c">
				<button class="btn cancel bg-purple" @tap="cancel">再想想</button>
				<button class="btn submit bg-yellow" @tap="submit">确认兑换</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				info: {},
				isInit: false,
				scorePrice: 10,
				total: 1
			}
		},
		props: {
			nodeType: {
				type: String
			},
			nodeUuid: {
				type: String
			}
		},
		computed: {},
		watch: {
		},
		onLoad(e) {
			
		},
		created() {
			this.initData()
		},
		methods: {
			switchChange(e) {
				this.isUseAdvisePrice = e.detail.value ? 1 : 0
			},
			initData() {
				// this.uuid = '606faf3333153'
				uni.showLoading()
				this.$http(`/activity/buy-ticket/preview`, 'post', {
					node_type: this.nodeType,
					node_uuid: this.nodeUuid
				}).then(res => {
					this.isInit = true
					this.info = res.data.info
					this.scorePrice = this.info.score_price
					uni.hideLoading()
				})
			},
			cancel() {
				this.$emit('cancel')
			},
			submit() {
				
				if (!this.total) {
					uni.showToast({
						title: '请输入兑换次数',
						icon: 'none'
					})
				}
				
				uni.showLoading()
				
				this.$http(`/activity/buy-ticket`, 'post', {
					node_type: this.nodeType,
					node_uuid: this.nodeUuid,
					total: this.total
				}).then(res => {
					uni.hideLoading()
					this.$emit('success')
				})
				
			},
			toPage(url) {
				uni.navigateTo({
					url: url
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.small-text {
		// font-size: 80%;
	}

	.mask {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mask-content {
		width: 660rpx;
		// height: 680rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 20rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 60rpx 60rpx 50rpx 60rpx;
		box-sizing: border-box;
		position: relative;

		.close-btn {
			position: absolute;
			right: 26rpx;
			top: 26rpx;

			color: #999;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
		}

		.sku-list {
			display: flex;
			justify-content: center;
			margin-top: 30rpx;
			margin: 30rpx -20rpx 0rpx -20rpx;
			// max-height: 560rpx;
			flex-wrap: wrap;
			
			
			
			.sku-c {
				text-align: center;
				margin: 20rpx 6rpx;
				position: relative;
				
				
				.stock-c {
					position: absolute;
					right: 0rpx;
					top: 0rpx;
					background: rgba(0, 0, 0, 0.4);
					color: white;
					font-size: 22rpx;
					font-weight: 500;
					padding: 0rpx 20rpx;
					border-radius: 20rpx;
				}
			
				.sku-thumb {
					width: 180rpx;
					height: 200rpx;
					border-radius: 20rpx;
					background: #f1f1f1;
				}
			
				.sku-title {
					font-size: 22rpx;
					color: #666;
					font-weight: 500;
					height: 60rpx;
					
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					line-clamp: 2;
					max-width: 180rpx;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			
			&.scroll-list {
				display: block;
				max-height: 50vh;
				width: 600rpx;
				// width: 
				.sku-c {
					float: left;
					// margin: 20rpx 6rpx 20rpx 0rpx;
				}
			}
		}

		.input-tips {
			margin-top: 30rpx;
			font-size: 28rpx;
			text-align: center;
		}
		
		.redpack-switch {
			margin-left: 10rpx;
			position: relative;
			left: 10rpx;
			transform: scale(0.8);
		}

		.money-c {
			
			padding: 30rpx 0rpx;
			text-align: center;
			margin-top: 30rpx;
			
			.input {
				background: #F2F2F2;
				border-radius: 10rpx;
				// line-height: 100rpx;
				height: 70rpx;
				margin: 0rpx 20rpx;
				// margin-right: 6rpx;
				width: 80rpx;
				text-align: center;
				font-size: 28rpx;
				font-weight: 500;
				padding: 4rpx 20rpx;
			}
			
			.input-c {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 20rpx;
			}
			
			.total {
				color: red;
				font-size: 32rpx;
				font-weight: 500;
			}
			
			.tips {
				font-size: 22rpx;
				color: red;
			}
		}
		
		.icon-check {
			color: #2BA246;
			font-size: 46rpx;
			position: relative;
			top: 4rpx;
			margin-right: 10rpx;
		}

		.btn-c {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn {
				padding: 0;
				margin: 50rpx 0rpx 0rpx 0rpx;
				width: 46%;
				border-radius: 20rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				background-color: #ffcc00;
				// box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
				color: white;

				&:after {
					border: none;
				}

				&.submit {}
			}
		}
	}
</style>
