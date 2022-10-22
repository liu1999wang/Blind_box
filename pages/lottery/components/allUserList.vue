<template>
	<view class="container">
		<view class="user-list">
			<template v-for="(item, index) in list">
				<template v-if="index === 0 || (list[index - 1].session !== item.session)">
					<view class="session-c">
						<view class="text">
							第 {{item.session}} 期
						</view>
					</view>
				</template>
				<view class="item" v-if="item.user">
					<image :src="item.user.headimg" class="headimg"></image>
					<view class="name">{{item.user.name.slice(0,1)}}...</view>
					<view class="ticket-count">{{item.tickets_count}}</view>
				</view>
			</template>
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
				type: 'all',
			}
		},
		computed: {},
		watch: {},
		mounted(e) {
			this.initList().then(res => {
				uni.hideLoading()
			})
		},
		onShow() {},
		onPullDownRefresh() {},
		methods: {
			initList() {
				uni.showLoading({
					title: '加载中'
				})

				return this.$http(`/lotteries/${this.uuid}/users`, 'GET', {
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

<style lang="scss" scoped>
	.container {
		
		.session-c {
			display: flex;
			justify-content: center;
			// justify-content: flex-start;
			flex: 0 0 700rpx;
			margin-bottom: 20rpx;
			
			margin-top: 50rpx;
			&:first-child {
				margin-top: 0rpx;
			}
			
			.text {
				text-align: center;
				background: rgba(0, 0, 0, 0.5);
				color: white;
				padding: 6rpx 30rpx;
				font-size: 26rpx;
				font-weight: 500;
				border-radius: 30rpx;
				margin-bottom: 10rpx;
			}
		}
		
		.user-list {
			display: flex;
			flex-wrap: wrap;
			// justify-content: space-between;
			// justify-content: center;
			margin-top: 10rpx;
			padding: 0rpx 15rpx;

			.item {
				width: 120rpx;
				flex: 0 0 120rpx;
				text-align: center;
				margin-bottom: 20rpx;
				position: relative;

				.headimg {
					width: 80rpx;
					height: 80rpx;
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
					background: #370eee;
					padding: 0rpx 6rpx;
					border-radius: 50rpx;
					right: 0rpx;
					top: -10rpx;
					font-size: 22rpx;
					min-width: 20rpx;
				}
			}
		}
	}
</style>
