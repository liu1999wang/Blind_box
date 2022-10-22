<template>
	<view class="container">
		<view class="user-list">
			<template  v-for="(item, index) in list">
				<template v-if="index === 0 || (list[index - 1].session !== item.session)">
					<view class="session-c">
						<view class="text">
							第 {{item.session}} 期
						</view>
					</view>
				</template>
				<view class="item global-shadow-2">
					<view class="left">
						<template v-if="item.user">
							<image :src="item.user.headimg" class="headimg"></image>
							<view class="name">{{item.user.name.slice(0,1)}}...</view>
							<view class="ticket-count">{{item.tickets_count}}</view>
						</template>
					</view>
					<view class="right">
						<view class="number">{{item.lucky_ticket.number}}</view>
						<view class="prize">{{item.lucky_ticket.sku.title}}</view>
					</view>
				</view>
			</template>
			<NoData v-if="!list.length"></NoData>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {
			uuid: String
		},
		data() {
			return {
				list: [],
				type: 'lucky',
			}
		},
		computed: {},
		watch: {},
		mounted () {
			uni.showLoading({
				title: '加载中'
			})

			this.initList().then(res => {
				uni.hideLoading()
			})
		},
		onShow() {},
		onPullDownRefresh() {},
		methods: {
			initList() {
				return this.$http(`/lotteries/${this.uuid}/lucky-users`, 'GET', {
					type: this.type,
					per_page: 1000
				}).then(res => {
					this.list = res.data.list
				})
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>

<style>
	page {
		background-color: #fcfcfc;
	}
</style>

<style lang="scss" scoped>
	.container {
		
		.session-c {
			display: flex;
			justify-content: center;
			
			margin-top: 50rpx;
			&:first-child {
				margin-top: 0rpx;
			}
			
			.text {
				text-align: center;
				background: rgba(0, 0, 0, 0.5);
				color: white;
				padding: 6rpx 30rpx;
				margin: 0rpx auto;
				display: block;
				display: inline-block;
				font-size: 26rpx;
				font-weight: 500;
				border-radius: 30rpx;
				margin-bottom: 10rpx;
			}
		}
		
		.user-list {
			// display: flex;
			// flex-wrap: wrap;
			// justify-content: space-between;
			// justify-content: center;

			margin-top: 10rpx;
			padding: 0rpx 20rpx;
			box-sizing: border-box;

			.item {
				// width: 120rpx;
				// flex: 0 0 120rpx;
				text-align: center;
				margin-bottom: 20rpx;
				padding: 20rpx 30rpx;
				position: relative;
				display: flex;
				width: 100%;
				box-sizing: border-box;
				border-radius: 20rpx;
				align-items: center;

				display: flex;
				// padding: 24rpx 0;
				border-bottom: 1px solid #f3f3f3;
				background: white;


				.headimg {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}

				.name {
					font-size: 24rpx;
					font-weight: 500;
					
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.ticket-count {
					position: absolute;
					color: white;
					background: #F27233;
					padding: 0rpx 6rpx;
					border-radius: 50rpx;
					right: 0rpx;
					top: -10rpx;
					font-size: 22rpx;
					min-width: 20rpx;
				}
				
				.right {
					flex-grow: 1;
					justify-content: flex-start;
					text-align: right;
					margin-left: 50rpx;
					
					.number {
						font-size: 36rpx;
						font-weight: 500;
					}
					.prize {
						font-size: 28rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
</style>
