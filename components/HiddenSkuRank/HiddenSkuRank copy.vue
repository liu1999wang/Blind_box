<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated bounceInUp" @tap.stop>
			<!-- <text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text> -->
			<view class="title">开盒榜单</view>
			<scroll-view scroll-y class="list" @scrolltolower="fetchList" v-if="list.length">
				<view class="item" v-for="(item, index) in list">

					<image :src="item.user.headimg" mode="aspectFit" class="headimg"></image>

					<view class="middle">
						<view class="name">{{item.user.name}}</view>
						<view class="time">{{$tool.formatDate(item.created_at, 'MM/dd hh:mm')}}</view>
						<view class="sku-title">抽到了 <span v-if="item.level == 0" class="hidden-sku">隐藏款</span> {{item.sku.title}}</view>
					</view>
					<view class="right">
						<image :src="item.sku.thumb" mode="aspectFit" class="thumb"></image>
						<!-- <view class="title">{{item.title}}</view> -->
					</view>
				</view>
				<NoMore></NoMore>
				<view style="height: 150rpx;"></view>
			</scroll-view>
			<NoData v-else title="暂无榜单" styleStr="margin-top: 80rpx;"></NoData>
		</view>
		
		<view class="close-btn" @tap="cancel">
			关闭榜单
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				list: [],
				isInit: false,
				total: 0,
				page: 1,
				perPage: 20,
			}
		},
		props: {
			uuid: {
				type: String
			}
		},
		computed: {},
		watch: {},
		onLoad(e) {

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
			fetchList() {
				if (this.isLoading)
					return false
			
				this.isLoading = true
			
				return this.$http(`/boxes/${this.uuid}/records`, 'GET', {
					page: this.page,
					per_page: this.perPage
				}).then(res => {
					this.isInit = true
					this.list = this.list.concat(res.data.list)
					this.isLoading = false
					this.page++
					this.total = res.data.item_total
				}).catch(err => {
					this.isInit = false
				})
			},
			cancel() {
				this.$emit('cancel')
			},
			submit() {
				uni.showLoading()
				this.$http(`/orders/${this.uuid}/return-sale`, 'POST').then(res => {
					this.isReturnSaleSuccess = 1
					uni.hideLoading()
					this.$emit('refresh')
					
					this.$store.dispatch("getUserInfo")
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
		// display: flex;
		// align-items: center;
		// justify-content: center;
		z-index: 1000;
		
		.close-btn {
			position: absolute;
			bottom: 50rpx;
			padding: 0;
			z-index: 1000;
		
			width: 400rpx;
			left: 175rpx;
		
			border-radius: 50rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #F27233;
			color: white;
			box-shadow: 0 0 20rpx rgba(242, 114, 51, 0.6);
		
		
			&:after {
				border: none;
			}
		
			&.disabled {
				background-color: #ddd;
				color: black;
				box-shadow: 0 0 20rpx #ddd;
			}
		}
		
	}
	
	.hidden-sku {
		font-size: 28rpx;
		font-weight: 500;
		background:  #FCF6D8;
		color: #F58348;
		padding: 4rpx 10rpx;
		font-size: 24rpx;
		border-radius: 6rpx;
		margin-left: 10rpx;
	}

	.mask-content {
		// width: 650rpx;
		width: 100%;
		min-height: 70vh;
		// height: 680rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 20rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		position: absolute;
		bottom: 0rpx;
		padding: 30rpx 20rpx 0rpx 20rpx;
		box-sizing: border-box;
		// position: relative;

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
			margin-bottom: 30rpx;
		}

		.list {
			height: 70vh;

			.item {
				display: flex;
				align-items: center;
				// justify-content: space-between;
				border-bottom: 1rpx solid #f1f1f1;
				margin-bottom: 20rpx;
				margin-right: 10rpx;
				margin-left: 30rpx;

				.headimg {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					flex: 0 0 80rpx;
				}


				.middle {
					flex-grow: 1;
					margin: 0rpx 10rpx 0rpx 20rpx;

					.name {
						font-size: 24rpx;
						font-weight: 500;

						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}

					.time {
						font-size: 24rpx;
						font-weight: 500;
					}

					.sku-title {
						font-size: 24rpx;
						font-weight: 500;
						text-align: left;
					}

				}

				.right {
					.thumb {
						width: 120rpx;
						height: 120rpx;
						border-radius: 10rpx;
						background: #f1f1f1;
					}

					.title {
						font-size: 24rpx;
						font-weight: 500;
					}
				}
			}
		}
	}
</style>
