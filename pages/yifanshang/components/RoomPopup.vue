<template>
	<view class="mask" @tap="cancel">
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<view style="display: flex; align-items: center; justify-content: space-between; padding: 10rpx 0;">
				<view class="title" style="text-align: left;">
					选择赏箱
				</view>
				<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
				
			</view>

			
			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<view v-for="(item, index) in list" hover-class="hover" class="item-scope" @tap="selectRoom(item)">
						<!-- v-if="item.stock === 0" -->
						<view class="sell-out-c" v-if="item.stock === 0"  >
						<image  mode="widthFix" class="sell-out" src="@/static/empty-stock-2.png"></image>
						</view>
						<view class="left">
							<view class="title" :class="{'small-font': item.num >= 99}"><text style="font-size: 42rpx; font-weight: 600; color: #fee4cb;">{{item.num}}</text>箱</view>
							<view class='stock' :class="{empty: item.stock === 0}">剩{{item.stock}}发</view>
						</view>
						<view class='right'>
							<view class="shang-row">
								<view>
								
								</view>
								<view v-for="shang in item.normal_skus" class="shang-item">
									<text class="title">{{shang.shang_title}}</text> 
									<view style="position: relative;">
										<ai-progress :percentage="parseFloat(shang.stock/shang.total).toFixed(2)*100" :noData="true" :stroke-width="12" bg-color="#ff0000" in-bg-color="#616161">
										</ai-progress>
										<view style="position: absolute; top: -2rpx; left: 0;  width: 100%; text-align: center;">{{shang.stock}}/{{shang.total}}</view>
									</view>
										
								</view>
							</view>
							<view class="shang-row">
								<view v-for="shang in item.gift_skus" class="shang-item">
									<text class="title">{{shang.shang_title}}</text>
									<view style="position: relative;">
										<ai-progress :percentage="parseFloat(shang.stock/shang.total).toFixed(2)*100" :noData="true" :stroke-width="12" bg-color="#ff0000" in-bg-color="#616161">
										</ai-progress>
										<view style="position: absolute;top: -2rpx; left: 0;  width: 100%; text-align: center;">{{shang.stock}}/{{shang.total}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="height: 30rpx;"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				isInit: false,
				list: [],
				page: 1,
				perPage: 20
			}
		},
		props: {
			info: {
				type: Object
			},
			room: {
				type: Object
			}
		},
		computed: {
		},
		watch: {
			payTotal () {
				this.initOrder()
			}
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				uni.showLoading({
					title: '加载中'
				})
				
				this.fetchList().then(res => {
					uni.hideLoading()
				})
			},
			fetchList () {
				if (this.isLoading)
					return false 
					
				this.isLoading = true
				
				return this.$http(`/yifanshang/${this.info.uuid}/rooms`, 'GET', {
					page: this.page,
					per_page: this.perPage
				}).then(res => {
					this.isInit = true
					this.list = this.list.concat(res.data.list)
					this.isLoading = false
					this.page++
				}).catch(err => {
					this.isInit = false
				})
			},
			selectRoom(item) {
				this.$emit('select', item)
			},
			cancel () {
				this.$emit('close')
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.small-text {
		// font-size: 80%;
	}

	.mask-content {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 1200rpx;
		background-color: #000000;
		border-radius: 10rpx 10rpx 0 0;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
	
		.close-btn {
		color: #FFFFFF;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
	
	.scroll-view {
		height: 1100rpx;
	}
	.sell-out-c {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		.sell-out {
			width: 90rpx;
			height: 90rpx;
		}
	}
	
	
	.list-scope {
		padding: 30rpx 10rpx;
	
		.item-scope {
			display: flex;
			// padding: 10rpx 0rpx;
			// border-bottom: 1rpx solid #F1F1F1;
			position: relative;
			
			border: .5px solid #1b1918;
			margin-bottom: 10rpx;
			background-color: #1b1918;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx;
			
			.stock {
				font-size: 18rpx;
				color: #bca8a9;
			}
			
			.left {
				// margin-right: 30rpx;
				position: relative;
				width: 100rpx;
				padding: 10rpx;
				flex: 0 0 90rpx;
				text-align: center;
				height: 100rpx;
				background: url('https://www.hebide.cc/newimages/newyi/box-bg.png') no-repeat;
				background-size: 100%;
				margin-right: 20rpx;
				.box-icon {
					width: 100rpx;
					height: 100rpx;
					color: red;
					font-size: 60rpx;
					text-align: center;
				}
				.title {
                    color: #bca8a9;
					font-size: 28rpx;
					font-weight: 500;
					
					&.small-font {
						font-size: 24rpx;
					}
				}
			}
			.right {
				width: 100%;
				.shang-row {
					display: flex;
					flex-wrap: wrap;
				}
				.shang-item {
					
					width: 21%;
					margin:10rpx 2%;
					font-weight: 500;
					font-size: 20rpx;
					text-align: center;
					.title {
						font-size: 20rpx;
						font-weight: 500;
						padding-bottom: 5rpx;
					}
				}
			}
			
		}
	}
	
</style>
