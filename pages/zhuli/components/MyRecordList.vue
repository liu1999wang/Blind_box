<template>
	<view class="mask" @tap="cancel">
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				我发起的助力
			</view>

			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<template v-for="(item, index) in list">
						<view hover-class="hover" class="item-scope global-shadow-2" @tap="selectItem(item)">
						
							<view class="user-c">
								<image :src="item.user && item.user.headimg" mode="aspectFill" class="headimg"></image>
								<!-- <view class="name">{{item.user && item.user.name}}</view> -->
								<!-- <view class="open-index" v-if="item.open_index">第{{item.open_index}}发</view> -->
								<view class="time">{{$tool.formatDate(item.created_at, 'MM/dd hh:mm:ss')}}发起</view>

								<view class="status working" v-if="item.union_status === 'working'">进行中</view>
								<view class="status closed bg-cancel" v-else-if="item.union_status === 'closed'">已失效</view>
								<view class="status completed bg-green" v-else-if="item.union_status === 'completed'">已完成</view>
								
							</view>
							
							<!-- <view class="sku-c">
								<image :src="item.sku.thumb" mode="aspectFit" class="thumb"></image>
								<view class="sku-title">{{item.sku.title}}</view>
								<view style="flex-grow: 1"></view>
								<view class="shang-title strong" style="margin-right: 10rpx;" v-if="item.is_free_order">免单</view>
								<view class="shang-title" :class="{strong: item.shang_type == 1}">{{item.shang_title}}</view>
								<view class="total">x1</view>
							</view> -->
							
						</view>
					</template>
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
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {
			tagList () {
				return this.info.skus.filter(item => {
					return item.shang_type === 0
				}).map(item => {
					return {
						title: item.shang_title,
						id: item.id
					}
				}).slice(0, 3)
			}
		},
		watch: {
			payTotal() {
				this.initOrder()
			},
		},
		created() {
			this.initData()
		},
		methods: {
			selectItem(item) {
				this.$emit('select', item)
			},
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

				return this.$http(`/zhuli/my-launch-records`, 'GET', {
					activity_id: this.info.id,
					page: this.page,
					per_page: this.perPage,
				}).then(res => {
					this.isInit = true
					this.list = this.list.concat(res.data.list)
					this.isLoading = false
					this.page++
					// this.total = res.data.item_total
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
		z-index: 11111;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.small-text {
		// font-size: 80%;
	}

	.mask-content {
		// position: absolute;
		// bottom: 0;
		// width: 100%;
		width: 650rpx;
		// height: 600rpx;
		background-color: #fdfdfd;
		// background-color: white;
		border-radius: 16rpx;
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
		// height: 260rpx;
		max-height: 600rpx;
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
					margin-left: 10rpx;
					flex: 1;
				}
				.status {
					font-size: 28rpx;
					font-weight: 500;
					background:  #FCF6D8;
					color: #F58348;
					padding: 4rpx 10rpx;
					font-size: 24rpx;
					border-radius: 6rpx;
					margin-left: 10rpx;
				}
			}
		
		}
	}
</style>
