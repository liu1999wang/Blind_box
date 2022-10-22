<template>
	<view class="mask" @tap="cancel">
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				开盒榜单
			</view>

			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<view v-for="(item, index) in list" hover-class="hover" class="item-scope global-shadow-2">

						<view class="user-c">
							<image :src="item.user && item.user.headimg" mode="aspectFill" class="headimg"></image>
							<view class="name">{{item.user && item.user.name}}</view>
							<!-- <view class="open-index" v-if="item.open_index">第{{item.open_index}}发</view> -->
							<view class="time">{{$tool.formatDate(item.created_at, 'MM/dd hh:mm')}}</view>
						</view>
						
						<view class="sku-c">
							<image :src="item.sku.thumb" mode="aspectFit" class="thumb"></image>
							<view class="sku-title">{{item.sku.title}}</view>
							<view style="flex-grow: 1"></view>
							<!-- <view class="shang-title strong" style="margin-right: 10rpx;" v-if="item.is_free_order">免单</view> -->
							<view class="shang-title strong" v-if="item.level == 0">隐藏款</view>
							<view class="total">x{{item.total}}</view>
						</view>
						
					</view>
					<NoData v-if="!list.length && isInit"></NoData>
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
				total: 0,
				page: 1,
				perPage: 20,
				tag: 'all'
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {
		},
		watch: {
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

				return this.$http(`/boxes/${this.info.uuid}/records`, 'GET', {
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
				this.$emit('close')
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.mask {
		z-index: 1111;
	}
	.small-text {
		// font-size: 80%;
	}

	.mask-content {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 1200rpx;
		background-color: #fdfdfd;
		// background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		

		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
		}
	}

	.scroll-view {
		height: 1100rpx;
	}

	.list-scope {
		padding: 30rpx 0rpx;

		.item-scope {
			// display: flex;
			// padding: 10rpx 0rpx;
			// border-bottom: 1rpx solid #F1F1F1;
			position: relative;
			
			background: white;

			border: 2px solid #999;
			margin-bottom: 20rpx;

			// display: flex;
			// align-items: center;
			padding: 30rpx 20rpx;

			.user-c {
				display: flex;
				align-items: center;
				.headimg {
					width: 40rpx;
					height: 40rpx;
					flex: 0 0 40rpx;
					border-radius: 50%;
				}

				.name {
					font-weight: 500;
					font-size: 28rpx;
					flex-grow: 1;
					margin-left: 10rpx;
				}
				.open-index {
					margin-right: 10rpx;
					font-weight: 400;
				}
				.time {
					font-weight: 500;
					font-size: 28rpx;
				}
			}
			
			.sku-c {
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				
				.thumb {
					width: 40rpx;
					height: 40rpx;
					border: 1rpx solid #e1e1e1;
					max-width: 400rpx;
				}
				
				.shang-title {
					font-size: 28rpx;
					font-weight: 500;
					&.strong {
						background:  #FCF6D8;
						color: #F58348;
						padding: 4rpx 10rpx;
						font-size: 24rpx;
						border-radius: 6rpx;
						margin-left: 10rpx;
						
					}
				}
				
				.total {
					margin-left: 20rpx;
				}
				
				.sku-title {
					font-size: 28rpx;
					font-weight: 500;
					// flex-grow: 1;
					text-align: left;
					margin-left: 10rpx;
					max-width: 410rpx;
					
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
</style>
