<template>
	<view class="container">
		<TextNavBar :title="title"></TextNavBar>

		<PageRender :page="page" theme="default"></PageRender>
		<!-- <view class="top-c">
			<image class="cat" src="https://cdn2.hquesoft.com/box/buyVip/cat.png" mode="widthFix"></image>
			<view class="text-c">
				<view class="left">
					<template v-if="userInfo.vip_status == 1">
						<view class="top-text">续费VIP</view>
						<view class="bottom-text">{{$tool.formatDate(userInfo.vip_end_at, 'yyyy/MM/dd')}}到期</view>
					</template>
					<template v-else>
						<view class="top-text">开通VIP</view>
						<view class="bottom-text">享受VIP会员专属权益</view>
					</template>
				</view>
				<button class="contact-btn" open-type="contact">
					<view class="icon new-iconfont icon-contact"></view>
					<text>客服</text>
				</button>
			</view>
		</view>
		<view class="body">
			<image mode="widthFix" class="bg" v-for="(url, index) in imageUrls" :src="url" v-if="imageUrls"></image>
			<NoData v-else></NoData>
		</view> -->
		<view class="footer safe-area-bottom global-shadow">
			<button class="submit" @tap="isShowSku=true">选择VIP套餐</button>
		</view>

		<PayCard v-if="isShowSku" @success="successPay" @cancel="isShowSku=false"></PayCard>

	</view>
</template>

<script>
	import PayCard from "./components/PayCard.vue"
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			PayCard
		},
		data() {
			return {
				isShowSku: false,
			}
		},
		mounted () {
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		computed: {
			...mapGetters(["userInfo"]),
			// imageUrls() {
			// 	return this.$store.getters.setting.vip_page.images
			// },
			title() {
				return this.$store.getters.setting.vip_page.title || 'VIP会员'
			},
			page() {
				return this.$store.getters.setting.vip_page
			}
		},
		methods: {
			successPay() {
				this.isShowSku = false
				uni.showModal({
					content: '恭喜您成功购买会员套餐~',
					success: (res) => {
						uni.switchTab({
							url: '/pages/center/index'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 34rpx 0rpx;

		.top-c {
			height: 383rpx;
			padding-top: 160rpx;
			box-sizing: border-box;
			background: url('https://cdn2.hquesoft.com/box/buyVip/bg.png');
			background-size: 100% auto;
			background-position: 0rpx 0rpx;
			background-repeat: no-repeat;

			display: flex;

			.cat {
				width: 218rpx;
				height: 233rpx;
				margin-left: 50rpx;
			}

			.text-c {
				background: url('https://cdn2.hquesoft.com/box/buyVip/text-card.png');
				background-size: 100% auto;
				background-position: 0rpx 0rpx;
				background-repeat: no-repeat;
				width: 478rpx;
				height: 148rpx;
				margin-top: 50rpx;
				padding: 0rpx 0rpx 20rpx 50rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;

				// justify-content: center;
				.left {
					flex-grow: 1;

					.top-text {
						font-size: 32rpx;
						font-weight: 800;
						color: #52311A;
					}

					.bottom-text {
						font-size: 20rpx;
						font-weight: 500;
						color: #8B7566;
					}
				}

				.contact-btn {
					padding: 0rpx;
					background: transparent;
					border: 0rpx !important;
					display: flex;
					flex-direction: column;
					line-height: 40rpx;
					margin-right: 30rpx;

					.icon {
						font-size: 36rpx;
					}

					text {
						font-size: 24rpx;
					}

					&:after {
						display: none;
					}
				}
			}
		}

		.body {
			border-radius: 20rpx 20rpx 20rpx 0rpx;
			position: relative;
			top: -20rpx;
			overflow: hidden;
			position: relative;
			// min-height: 600rpx;
			width: 100%;

			.bg {
				width: 100%;
			}

			.price-c {
				position: absolute;
				top: 180rpx;
				width: 100%;

				.item {
					background-size: 100% auto;
					background-repeat: no-repeat;
					height: 206rpx;
					display: flex;
					align-items: center;
					box-sizing: border-box;
					padding: 0rpx 70rpx;
					padding-bottom: 10rpx;

					&.month {
						background: url('https://cdn2.hquesoft.com/box/buyVip/card-1.png');
						background-size: 100% auto;
						background-repeat: no-repeat;
					}

					&.year {
						background: url('https://cdn2.hquesoft.com/box/buyVip/card-2.png');
						background-size: 100% auto;
						background-repeat: no-repeat;
					}

					.left {
						flex-grow: 1;

						.text {
							font-size: 46rpx;
							font-weight: bold;
							color: #FFFFFF;
						}

						.desc {
							font-size: 26rpx;
							font-weight: bold;
							color: #Fefefe;
						}
					}

					.right {
						font-size: 40rpx;
						font-weight: bold;
						color: #FFFFFF;
					}
				}
			}
		}

		.footer {
			position: fixed;
			width: 100%;
			bottom: 0rpx;
			left: 0rpx;

			.submit {
				border: 0rpx;
				background: #FFCC0B;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				text-align: center;
				line-height: 96rpx;
				border-radius: 50rpx;
				width: 660rpx;
				margin: 0rpx auto 30rpx;

				&::after {
					display: none;
				}
			}
		}
	}
</style>
