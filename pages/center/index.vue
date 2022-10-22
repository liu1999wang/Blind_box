<template>
	<view class="container" style="padding-bottom: 160rpx;">
		<view class="header">
			<image @tap="toProfilePage" :src="userInfo.headimg || 'https://cdn2.hquesoft.com/box/headimg/unlogin.png'" v-if="isLogin" hover-class="hover" class="headimg"></image>
			<image v-else @tap="toLoginPage" :src="'https://cdn2.hquesoft.com/box/headimg/unlogin.png'" hover-class="hover" class="headimg"></image>
			<view class="middle">
				<view class="name" v-if="isLogin">{{userInfo.name}}</view>
				<view v-else @tap="toLoginPage">点击登录</view>
				<!-- <text class="id">ID: {{userInfo.uuid}}</text> -->
				<!-- #ifndef MP-ALIPAY -->
				<template v-if="config.is_show_vip">
					<view class="vip-c" v-if="userInfo.vip_status == 1"  @tap="toBuyVip">
						<text class="new-iconfont icon-vip"></text>
						<text>{{$tool.formatDate(userInfo.vip_end_at, 'yyyy-MM-dd')}} 到期</text>
					</view>
					<view class="vip-c disabled" v-else @tap="toBuyVip">
						<text class="new-iconfont icon-vip"></text>
						<text>开通VIP会员</text>
					</view>
				</template>
				<!-- #endif -->
			</view>
			<div style="flex-grow: 1;"></div>
			
			<!-- #ifndef MP-KUAISHOU -->
			<button class="right" open-type="contact" v-if="isMiniappAndUseMiniappKf">
				<text class="new-iconfont icon-contact">客服</text>
			</button>
			<button class="right" @tap="openContact" v-else>
				<text class="new-iconfont icon-contact">客服</text>
			</button>
			<!-- #endif -->
			
		</view>
		<view class="status-bar">
			<view class="item" @tap="toDetail('/pages/myRedpack/index')">
				<view class="number"><span class="small-font">￥</span>{{(userInfo.redpack || 0) / 100}}</view>
				<view class="text" style="color: #000;">余额</view>
			</view>
			<view class="line"></view>
			<view class="item" @tap="toDetail('/pages/myScore/index')">
				<view class="number">{{userInfo.score || 0}}</view>
				<view class="text" style="color: #000;">{{scoreAlias}}</view>
			</view>
<!-- 			<view class="line"></view>
			<view class="item" @tap="toDetail('/pages/myChip/index')">
				<view class="number">{{userInfo.chip_count || 0}}</view>
				<view class="text" style="color: #FFF;">碎片</view>
			</view> -->
			<template v-if="config.is_show_invite_total">
				<view class="line"></view>
				<view class="item" @tap="toDetail('/pages/myInvitees/index')">
					<view class="number">{{userInfo.invitees_count || 0}}<span class="small-font">人</span></view>
					<view class="text" style="color: #000;">邀请记录</view>
				</view>
			</template>
		</view>
		<view class="order-c">
			<view class="top">
				<view class="title">我的订单</view>
				<view class="all-btn" @tap="toDetail('/pages/orderList/index?status=all')">
					全部订单
					<text class="icon new-iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="body">
<!-- 				<view class="item" @tap="toDetail('/pages/myBox/index?status=pending')" hover-class="hover">
					<view v-if="orderStat.pending_package_sku" class="dot">
						{{orderStat.pending_package_sku}}
					</view>
					<image mode="widthFix" style="width: 66rpx; height: 59rpx;" src="@/static/center/order-pending.png"></image>
					<text>盒柜</text>
				</view> -->
				<view class="item" @tap="toDetail('/pages/orderList/index?status=pay_pending')" hover-class="hover">
					<view v-if="orderStat.pay_pending" class="dot">
						{{orderStat.pay_pending}}
					</view>
					<image mode="widthFix" style="width: 66rpx; height: 59rpx;" src="@/static/center/order-return-sale.png"></image>
					<text>待付款</text>
				</view>
				<view class="item" @tap="toDetail('/pages/orderList/index?status=deliver_pending')" hover-class="hover">
					<view v-if="orderStat.deliver_pending" class="dot">
						{{orderStat.deliver_pending}}
					</view>
					<image mode="widthFix" style="width: 66rpx; height: 59rpx;" src="@/static/center/order-deliver-pending.png"></image>
					<text>待发货</text>
				</view>
				<view class="item" @tap="toDetail('/pages/orderList/index?status=delivered')" hover-class="hover">
					<view v-if="orderStat.delivered" class="dot">
						{{orderStat.delivered}}
					</view>
					<image mode="widthFix" style="width: 66rpx; height: 59rpx;" src="@/static/center/order-delivered.png"></image>
					<text>已发货</text>
				</view>
			</view>
		</view>
		<!-- <image class="share-banner" @tap="toDetail('/pages/rule/index?type=share')" src="https://cdn2.hquesoft.com/box/share-banner.png"
		 hover-class="hover" /> -->
		<Banner class="center-banner" v-if="config.banner && config.banner.length" :list="config.banner" iStyle="height: 220rpx;" imageStyle="border-radius: 50rpx 50rpx 0rpx 0rpx; box-shadow: 10px 10rpx 10rpx 10rpx rgba(243, 238, 220, 0.4);"></Banner>
		<view class="action-list action-list-1">
			<!-- <view class="item">
			<view  class="left-icon">
				<image style="width: 40rpx; height: 40rpx;" src="@/static/center/tishi.png"></image>
				</view>
				<view class="text">提示卡</view>
				<view class="total">2</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view> -->
			<view class="item" @tap="toDetail('/pages/myCoupons/index')" hover-class="hover">
				<view class="left-icon">
					<image src="@/static/center/coupon.png"></image>
				</view>
				<view class="text">优惠券</view>
				<view class="total">{{userInfo.coupon_count || 0}}</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
			<view class="item" @tap="toDetail('/pages/myCard/index')" hover-class="hover">
				<view class="left-icon">
					<image style="width: 30rpx; height: 30rpx;" src="@/static/center/toushi.png"></image>
				</view>
				<view class="text">道具卡</view>
				<view class="total">{{userInfo.card_total || 0}}</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
			<!-- <view class="item" @tap="toDetail('/pages/myActivity/index')" hover-class="hover">
				<view class="left-icon">
					<image style="width: 26rpx; height: 30rpx;" src="@/static/center/activity.png"></image>
				</view>
				<view class="text">我的活动</view>
				<view class="total">{{userInfo.working_activity}}</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view> -->
			<view class="item" @tap="toDetail('/pages/code/index')" hover-class="hover">
				<view class="left-icon">
					<image style="width: 30rpx; height: 30rpx;" src="@/static/center/rule.png"></image>
				</view>
				<view class="text">兑换码</view>
				<!-- <view class="total">0</view> -->
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
		</view>
		
		<view class="action-list">
			<view class="item" v-for="(item, index) in items" @tap="toLink(item.link)" hover-class="hover">
				<view class="left-icon">
					<image :src="item.image"></image>
				</view>
				<view class="text">{{item.text}}</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
		</view>

		<!-- <view class="action-list">
			<view class="item" @tap="toDetail('/pages/cart/index')" hover-class="hover">
				<view class="left-icon">
					<image src="@/static/center/cart.png"></image>
				</view>
				<view class="text">购物车</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
			<view class="item" @tap="toDetail('/pages/myAddress/index')" hover-class="hover">
				<view class="left-icon">
					<image src="@/static/center/address.png"></image>
				</view>
				<view class="text">收货地址</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
			<view class="item" @tap="toDetail('/pages/rule/index')" hover-class="hover">
				<view class="left-icon">
					<image style="width: 30rpx; height: 32rpx;" src="@/static/center/rule.png"></image>
				</view>
				<view class="text">规则与协议</view>
				<text class="icon new-iconfont icon-arrow-right"></text>
			</view>
		</view> -->

		<!-- #ifndef MP-ALIPAY -->
		<FloatBtn v-if="floatBtn.is_show" :link="floatBtn.link" :isAnimated="floatBtn.is_animate" :src="floatBtn.image"></FloatBtn>
		<!-- #endif -->
		
		<view class="copyright-c" v-if="config.copyright">{{config.copyright}}</view>
		<view class="version-c">版本: v{{version}}</view>
		<tab-bar :isselected="3"></tab-bar>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	export default {
		name: "center",
		components: {},
		data() {
			return {
				// code: '',
				version: '3.9.14',
				init: false,
				orderStat: {}
			}
		},
		computed: {
			...mapGetters(["deviceInfo", "userInfo", "token", "personalSettings"]),
			isLogin() {
				return this.token ? true : false
			},
			userName() {
				return this.token ? this.userInfo.name : "点击登录"
			},
			avatar() {
				return this.token ? this.userInfo.headimg : "/static/toux.png"
			},
			config() {
				return this.$store.getters.setting.user_center
			},
			items() {
				return this.config && this.config.items || []
			},
			isAnimated() {
				return true
			},
			floatBtn() {
				return {
					is_show: this.config.is_show_float_btn,
					link: this.config.float_btn_link,
					image: this.config.float_btn_image,
					is_animate: this.config.float_btn_is_animate
				}
			}
		},
		onLoad() {
	
			this.$visitor.record('center');
			
			// #ifdef H5
			uni.setNavigationBarTitle({
				title: '个人中心'
			})
			// #endif
		},
		onShow() {
			if (this.isLogin) {
				this.$store.dispatch("getUserInfo").then(res => {
					this.$http('/order-stat').then(res => {
						this.orderStat = res.data.info
					})
				})
			}
		},
		methods: {
			toProfilePage() {
				uni.navigateTo({
					url: '/pages/myProfile/index'
				})
			},
			toDetail(url) {
				uni.navigateTo({
					url: url
				})
			},
			toDayTask() {
				this.isAnimated = false
				uni.navigateTo({
					url: '/pages/dayTask/index'
				})
			},
			toBuyVip() {
				uni.navigateTo({
					url: '/pages/buyVip/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.version-c {
		text-align: center;
		font-size: 90%;
		// font-weight: 500;
		color: #999;
		// margin-bottom: 50rpx;
		// height: 80rpx;
		height: 80rpx;
	}
	
	.copyright-c {
		text-align: center;
		font-size: 90%;
		// font-weight: 500;
		color: #999;
		// margin-bottom: 50rpx;
		// height: 50rpx;
		// margin-top: ;
		height: 50rpx;
	}
	
	page {
		background: url('@/static/center/bg.png');
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #f5f8fc;
	}

	.container {
		padding-top: 60px;
		
		/* #ifdef H5 */
		padding-top: 20px;
		/* #endif */
	}
	
	.small-font  {
		font-size: 24rpx;
	}
	
	.header {
		display: flex;
		align-items: center;

		.headimg {
			width: 160rpx;
			flex: 0 0 160rpx;
			margin: 0rpx 30rpx;
			height: 160rpx;
			border-radius: 50%;
			border: 10rpx solid white;
			box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
		}

		.middle {
			// flex-grow: 1;
			display: flex;
			flex-direction: column;

			.name {
				font-size: 34rpx;
				font-weight: bold;
				color: #111111;
			}

			// .id {
			// 	height: 36rpx;
			// 	background: #FFF8DD;
			// 	border-radius: 18rpx;
			// 	color: #FFCC09;
			// 	font-size: 20rpx;
			// 	font-weight: 500;
			// 	line-height: 36rpx;
			// 	padding: 0rpx 18rpx;
			// 	margin-top: 20rpx;
			// }

			.vip-c {
				margin-top: 20rpx;
				padding: 0rpx 20rpx;
				border-radius: 50rpx;
				display: flex;
				align-items: center;
				// width: auto;
				// width: 200rpx;
				background: #FFF8DD;
				// display: inline-block;


				.icon-vip {
					// color: #666;
					margin-right: 10rpx;
					font-size: 36rpx;
					line-height: 40rpx;
				}

				font-size: 24rpx;
				font-weight: 500;
				color: #FFCC09;

				&.disabled {
					color: #999999;
				}
			}
		}

		.right {
			margin-right: 30rpx;

			padding: 0rpx;
			font-size: 26rpx;
			// padding: 0rpx 20rpx;
			width: 130rpx;
			border-radius: 100rpx !important;
			line-height: 50rpx;
			overflow: hidden;
			height: 50rpx;
			color: black;
			background-color: #FFF8DD;


			&::after {
				display: none;
			}

			// box-shadow: 0px 18px 30px 0px rgba(255, 187, 42, 0.7);
		}

	}
	
	/* #ifdef MP-ALIPAY */
	.header {
		margin-top: 50rpx;
		.headimg {
			width: 120rpx;
			height: 120rpx;
			flex: 0 0 120rpx;
		}
	}
	/* #endif */

	.status-bar {
		display: flex;
		margin: 50rpx 0rpx 30rpx 0rpx;
		align-items: center;

		.line {
			height: 40rpx;
			width: 1rpx;
			flex: 0 0 1rpx;
			border-left: 1rpx solid #999;
		}

		.item {
			flex-grow: 1;
			text-align: center;

			.number {
				color: black;
				font-size: 32rpx;
				font-weight: 700;
				line-height: 40rpx;
			}

			.text {
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
	}

	.order-c {
		width: 700rpx;
		height: 200rpx;
		background: #FFFFFF;
		box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.4);
		border-radius: 20rpx;
		margin: 0rpx auto;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		margin-bottom: 30rpx;

		.top {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			.title {
				font-weight: bold;
				color: #333333;
				font-size: 28rpx;
				flex-grow: 1;
			}

			.all-btn {
				font-size: 24rpx;
				font-weight: 500;
				color: #FFCC09;
			}
		}

		.body {
			display: flex;
			align-items: flex-end;
			width: 90%;
			margin: auto;
			justify-content: space-between;
			.item {
				// border: 1px solid red;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				// flex-grow: 1;

				text {
					font-weight: bold;
					color: #333333;
					font-size: 24rpx;
				}
				
				.dot {
					left: 60%;
					bottom: 76rpx;
					position: absolute;
					height: 30rpx;
					line-height: 30rpx;
					background: #FF6B14;
					// border-radius: 30rpx;
					border-radius: 50rpx;
					text-align: center;
					// min-width: 30rpx;
					padding: 0rpx 10rpx;
				
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
				}
			}
		}
	}

	.center-banner {
		width: 680rpx !important;
		// border: 1px solid red;
		height: 160rpx !important;
		display: block;
		margin: 0rpx auto 0rpx auto;
	}

	// .action-list-1 {
	// 	position: relative;
	// 	top: -50rpx;
	// }

	.action-list {
		width: 700rpx;
		margin: 0rpx auto 20rpx auto;
		background: #FFFFFF;
		box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.16);
		border-radius: 20rpx;

		position: relative;
		top: -10rpx;
		
		/* #ifdef APP-PLUS */
		top: -20rpx;
		/* #endif */
		

		.item {
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx 30rpx 30rpx;
			border-bottom: 1rpx solid #F3F3F3;

			.left-icon {
				width: 60rpx;
				flex: 0 0 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 34rpx;
					height: 34rpx;
				}
			}

			.text {
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
				flex-grow: 1;
			}

			.total {
				height: 40rpx;
				background: #F2F2F2;
				border-radius: 20rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
				padding: 0rpx 30rpx;
				margin-right: 10rpx;
			}

			.icon-arrow-right {
				display: flex;
				align-items: center;
				font-size: 42rpx;
				display: block;
				color: #aaa;
				line-height: 42rpx;
				padding: 0rpx;
			}
		}
	}

	.float-btn {
		width: 160rpx;
		height: 160rpx;
		position: fixed;
		right: 10rpx;
		bottom: 160rpx;
	}

	@keyframes yaoyiyao {
		0% {
			transform: scale(1) rotate(-4deg);
		}

		25% {
			transform: rotate(0deg);
		}

		50% {
			transform: scale(1.1) rotate(4deg);
		}

		75% {
			transform: rotate(0deg);
		}

		100% {
			transform: scale(1) rotate(-4deg);
		}
	}
</style>
