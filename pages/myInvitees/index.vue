<template>
	<view class="container">
		<view class="header-tabs">
			<view class="tab-item" :class="{active:current==0}" :data-current="0" @tap="current = 0">
				<text class="text">
					邀请记录
				</text>
			</view>
			<view class="tab-item" :class="{active:current==1}" :data-current="1" @tap="current = 1">
				<text class="text">
					分销订单
				</text>
			</view>
		</view>

		<view class="swiper-wrapper">
			<swiper :current="current" @change="swiperChange">
				<swiper-item>
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<UserItem :info="item" v-for="(item, index) in userList"></UserItem>
						<NoData v-if="!userList.length"></NoData>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<AgentRecordItem :info="item" v-for="(item, index) in orderList"></AgentRecordItem>
						<NoData v-if="!orderList.length"></NoData>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<view class="footer-c global-shadow safe-area-bottom">
			<view class="btn-c">
				<navigator class="btn" url="/pages/rule/index?type=share">
					<button class="btn check-rule">查看分销规则</button>
				</navigator>
				<navigator class="btn" url="/pages/myRedpack/index">
					<view>红包记录</view>
				</navigator>
			</view>
		</view>

	</view>
</template>

<script>
	import UserItem from "./components/UserItem"
	import AgentRecordItem from "./components/AgentRecordItem"
	export default {
		components: {
			UserItem,
			AgentRecordItem
		},
		data() {
			return {
				current: 0,
				userList: [],
				orderList: [],
				// total: 0,
				page: 1,
				per_page: 20,
				// init: false,
				// loading: false
			}
		},
		computed: {},
		async onLoad(e) {
			this.current = e.actived || 0

			uni.showLoading({
				title: '加载中'
			})

			this.initData()

			uni.hideLoading()
		},
		onShow() {
			// this.initData()
		},
		methods: {
			initData() {
				this.$http('/user/invitees', 'get', {
					per_page: this.per_page,
					page: this.page,
					type: 'direct'
				}).then(res => {
					this.userList = res.data.list
				})

				this.$http({
					url: '/agent/brokerages',
					method: 'get',
					params: {
						per_page: this.per_page,
						page: this.page
					}
				}).then(res => {
					this.orderList = res.data.list
				})
			},
			fetchNextPage() {
				if (this.loading) {
					return false
				}
				this.loading = true
				this.page++
				this.$http('/user/invitees', 'get', {
					per_page: this.per_page,
					page: this.page,
					type: 'direct'
				}).then(res => {
					this.userList = this.userList.concat(res.data.list)

					this.loading = false
				})
			},
			swiperChange(e) {
				let index = e.detail.current
				this.current = index
			},
			scrolltolower() {
				this.fetchNextPage()
			}
		}
	}
</script>
<style>
	page {
		background: #fafafa;
	}
</style>
<style lang="scss" scoped>
	.container {}

	.header-tabs {
		width: 100%;
		height: 90rpx;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		background-color: #ffffff;

		.tab-item {
			flex: 1;
			line-height: 90rpx;
			text-align: center;
			font-size: 28rpx;
			color: #999;

			&.active {
				color: #0E151D;
				position: relative;
				font-weight: 500;

				.text {
					border-bottom: 4rpx solid #333;
					padding: 0rpx 16rpx 4rpx 16rpx;
				}

				// &::after {
				// 	content: "";
				// 	position: absolute;
				// 	height: 2px;
				// 	left: 20rpx;
				// 	right: 20rpx;
				// 	bottom: 0;
				// 	background-color: #0E151D;
				// }
			}
		}
	}

	.list {}

	swiper {
		height: 100vh;
		padding-top: 100rpx;
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		top: 0rpx;
		left: 0rpx;

		swiper-item {
			height: 100%;
		}

		scroll-view {
			height: 100%;
			// border: 1px solid red;
		}
	}

	.footer-c {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		left: 0rpx;
		background: white;

		.btn-c {
			display: flex;
			justify-content: space-between;
			width: 100%;
			box-sizing: border-box;
			padding: 20rpx 60rpx 20rpx 60rpx;
		}

		.btn {
			width: 280rpx;
			height: 78rpx;
			background: rgba(242, 114, 51, 1);
			border-radius: 100rpx;
			color: white;
			font-weight: bold;
			text-align: center;
			line-height: 78rpx;
			border: 0rpx;
			font-size: 28rpx;

			margin: 0rpx;

			&:after {
				display: none;
			}

			&.check-rule {
				border: 2rpx solid rgba(242, 114, 51, 1);
				background: white;
				color: rgba(242, 114, 51, 1);
			}
		}

	}
</style>
