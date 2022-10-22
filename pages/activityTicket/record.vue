<template>
	<view class="container" :style="'padding-top:' + (navBar + 150) + 'px'">
		<TextNavBar title="活动邀请记录"></TextNavBar>

		<view class="top" :style="'padding-top:' + navBar + 'px'">
			<view class="card">
				<image mode="aspectFill" class="headimg" :src="userInfo.headimg" />
				<view class="right">
					<!-- <view class="name">{{userInfo.name}}</view> -->
					<view class="bar">
						<view class="item">
							<view class="number">{{inviteTotal}}</view>
							<view class="key">邀请人数</view>
						</view>
						<view class="item">
							<view class="number">{{stock}}</view>
							<view class="key">可用次数</view>
						</view>
						<view class="item">
							<view class="number">{{usedTotal}}</view>
							<view class="key">已抽次数</view>
						</view>
					</view>
				</view>
			</view>

			<view class="header-tabs">
				<view class="tab-item" :class="{active:current==0}" :data-current="0" @tap="current = 0">
					<text class="text">
						邀请记录
					</text>
				</view>
				<view class="tab-item" :class="{active:current==1}" :data-current="1" @tap="current = 1">
					<text class="text">
						次数记录
					</text>
				</view>
			</view>


			<view class="swiper-wrapper">
				<swiper :current="current" @change="swiperChange">
					<swiper-item>
						<scroll-view class="list" scroll-y @scrolltolower="scrolltolower">
							<UserItem :info="item" v-for="(item, index) in userList.list"></UserItem>
							<view style="height: 50rpx;"></view>
							<NoData v-if="!userList.list.length"></NoData>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view class="list" scroll-y @scrolltolower="scrolltolower">
							<TicketItem :info="item" v-for="(item, index) in ticketList.list"></TicketItem>
							<view style="height: 50rpx;"></view>
							<NoData v-if="!ticketList.list.length"></NoData>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- <navigator url="/pages/myScore/buy" v-if="isBuyEnabled">
			<view class="footer safe-area-bottom">
				<view class="footer-button" hover-class="hover">
					<text>充值</text>
				</view>
			</view>
		</navigator> -->

		<view class="footer-c global-shadow safe-area-bottom">
			<view class="btn-c">
				<button class="btn check-rule" @tap="checkRule">查看邀请规则</button>
				<view class="btn" @tap="handleShare">转发邀请</view>
			</view>
		</view>
		
		<Rule v-if="isShowRule" @cancel="isShowRule=false" :info="info"></Rule>

	</view>
</template>

<script>
	import TicketItem from "./components/TicketItem"
	import UserItem from "./components/UserItem"
	import Rule from "./components/Rule"
	// import AgentRecordItem from "./components/AgentRecordItem"

	export default {
		components: {
			TicketItem,
			UserItem,
			Rule
		},
		data() {
			return {
				userList: {
					list: [],
					page: 1,
					loading: false
				},
				ticketList: {
					list: [],
					page: 1,
					loading: false
				},
				inviteTotal: 0,
				stock: 0,
				usedTotal: 0,
				uuid: '',
				nodeType: '',
				current: 0,
				perPage: 10,
				isSharePopup: false,
				isShowRule: false,
				info: {}
			}
		},
		computed: {
			navBar() {
				return this.$store.getters.deviceInfo.customBar
			},
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		async onLoad(e) {
			this.uuid = e.uuid
			this.nodeType = e.node_type

			// uni.showLoading({
			// 	title: '加载中'
			// })
		},
		onUnload () {
			uni.$emit('refreshFreeTicketTotal')
		},
		onShow() {
			this.$http('/activity/ticket-total', 'GET', {
				uuid: this.uuid,
				node_type: this.nodeType
			}).then(res => {
				this.inviteTotal = res.data.invite_total
				this.usedTotal = res.data.used_total
				this.stock = res.data.stock
				
				this.info = res.data
			})

			this.initTicketList()
			this.initUserList()
		},
		methods: {
			checkRule() {
				this.isShowRule = true
			},
			handleShare() {
				uni.navigateBack()
				uni.$emit('startShare')
				// this.isSharePopup = true
			},
			initTicketList() {
				if (this.ticketList.loading) return
				this.ticketList.loading = true

				this.$http('/activity/ticket-records', 'GET', {
					uuid: this.uuid,
					per_page: this.perPage,
					page: this.ticketList.page
				}).then(res => {
					this.ticketList.loading = false
					this.ticketList.page++
					this.init = true
					this.ticketList.list.push(...res.data.list)
				})
			},
			initUserList() {
				if (this.userList.loading) return
				this.userList.loading = true

				this.$http('/activity/invite-records', 'GET', {
					node_uuid: this.uuid,
					per_page: this.perPage,
					page: this.userList.page
				}).then(res => {
					this.userList.loading = false
					this.userList.page++
					this.init = true
					this.userList.list.push(...res.data.list)
				})
			},
			swiperChange(e) {
				let index = e.detail.current
				this.current = index
			},
			scrolltolower() {
				if (this.current === 1) {
					// 刷新次数记录列表
					this.initTicketList()
				} else if (this.current === 0) {
					// 刷新邀请记录列表
					this.initUserList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header-tabs {
		width: 100%;
		height: 90rpx;
		display: flex;
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
			}
		}
	}


	.top {
		background: white;
		background-image: url('@/static/top-bg.png');
		background-size: 100% auto;
		background-repeat: no-repeat;
		position: fixed;
		width: 100%;
		top: 0rpx;
		z-index: 10;
		padding-bottom: 10px;

		.card {
			display: flex;
			width: 670rpx;
			height: 174rpx;
			background: #FFFFFF;
			box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.4);
			border-radius: 20rpx;
			// margin-top: 20rpx;
			margin: 20rpx auto;
			padding: 10rpx 40rpx;
			align-items: center;
			box-sizing: border-box;

			.headimg {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 50rpx;
				border: 10rpx solid white;
				box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
			}

			.right {
				flex-grow: 1;

				.bar {
					display: flex;
					justify-content: space-between;

					.item {
						text-align: center;

						.number {
							font-size: 32rpx;
							font-weight: 800;
							color: #000000;
						}

						.key {
							font-size: 24rpx;
							font-weight: 500;
							color: #C6C6C6;
						}
					}
				}
			}
		}
	}

	.list {
		height: 100%;
		// border: 1px solid red;
		// padding-bottom: 100rpx;
	}

	.swiper-wrapper {
		height: 100vh;
	}

	swiper {
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 100vh;
		// padding-bottom: 680rpx;
		padding-bottom: 680rpx;
	}

	.footer-c {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		left: 0rpx;
		background: white;
		z-index: 10;

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
