<template>
	<view class="container">
		<view class="header-tabs">
			<view class="tab-item" :class="{active:current==0}" :data-current="0" @tap="current = 0">
				<text class="text">
					中奖用户
					<!-- ({{luckyUserTotal}}) -->
				</text>
			</view>
			<view class="tab-item" :class="{active:current==1}" :data-current="1" @tap="current = 1">
				<text class="text">
					所有用户
					<!-- ({{allUserTotal}}) -->
				</text>
			</view>
		</view>

		<view class="swiper-wrapper">
			<swiper :current="current" @change="swiperChange">
				<swiper-item>
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<LuckyUserList :uuid="uuid" @refresh="initData" :info="item"></LuckyUserList>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<AllUserList :uuid="uuid" :info="item"></AllUserList>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<!-- <view class="footer-c global-shadow safe-area-bottom">
			<view class="btn-c">
				<navigator class="btn" url="/pages/shareRule/index">
					<button class="btn check-rule">查看分销规则</button>
				</navigator>
				<navigator class="btn" url="/pages/myRedpack/index">
					<view>红包记录</view>
				</navigator>
			</view>
		</view> -->

	</view>
</template>

<script>
	import LuckyUserList from "./components/luckyUserList"
	import AllUserList from "./components/allUserList"
	export default {
		components: {
			LuckyUserList,
			AllUserList
		},
		data() {
			return {
				uuid: '',
				current: 0,
				allUserList: [],
				luckyUserList: [],
				allUserTotal: 0,
				luckyUserTotal: 0,
				// total: 0,
				// page: 1,
				// per_page: 20,
				// init: false,
				// loading: false
			}
		},
		computed: {},
		async onLoad(e) {
			this.current = e.actived || 0
			this.uuid = e.uuid
		},
		onShow() {
			uni.showLoading({
				title: '加载中'
			})
			// this.initData()
		},
		methods: {
			// initData() {
			// 	this.fetchAllUserList()
			// 	this.fetchLuckyUserList()
			// },
			// fetchAllUserList() {
			// 	this.$http(`/lottery/${this.uuid}/my-invitees`, 'GET', {
			// 		per_page: 200
			// 	}).then(res => {
			// 		this.inviteeList = res.data.list
			// 		this.inviteeTotal = res.data.item_total
			// 		uni.hideLoading()
			// 	})
			// },
			// fetchLuckyUserList() {
			// 	this.$http(`/lottery/${this.uuid}/my-tickets`, 'GET', {
			// 		per_page: 50,
			// 		is_lucky: 1
			// 	}).then(res => {
			// 		this.luckyTicketList = res.data.list
			// 		this.luckyTicketTotal = res.data.item_total
			// 	})
			// },
			swiperChange(e) {
				let index = e.detail.current
				this.current = index
			},
			scrolltolower() {

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
			font-weight: 500;

			&.active {
				color: #370eee;
				position: relative;
				font-weight: 600;

				.text {
					border-bottom: 4rpx solid #370eee;
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
