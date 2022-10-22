<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated bounceInLeft" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">{{info.title}}</view>
			
			<view class="desc">
				当前登陆用户需要符合以下条件才能享受此专享价优惠:
			</view>
			<view class="rule-c">
				<view class="item" v-if="options.vip.is_used">
					<view class="key">已成为VIP会员</view>
					<view class="status passed" v-if="options.vip.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed" @tap="toCheck('vip')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
				<view class="item" v-if="options.birthday.is_used">
					<view class="key">已填写生日</view>
					<view class="status passed" v-if="options.birthday.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed" @tap="toCheck('birthday')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
				<view class="item" v-if="options.phone.is_used">
					<view class="key">已填写手机号</view>
					<view class="status passed" v-if="options.phone.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed" @tap="toCheck('phone')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
				<view class="item" v-if="options.level_score.is_used">
					<view class="key">成长值{{options.level_score.type}}{{options.level_score.value}}</view>
					<view class="status passed" v-if="options.level_score.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed" @tap="toCheck('level_score')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
				<view class="item" v-if="options.invitee_total.is_used">
					<view class="key">邀请人数{{options.invitee_total.type}}{{options.invitee_total.value}}人</view>
					<view class="status passed" v-if="options.invitee_total.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed" @tap="toCheck('invitee_total')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
				<view class="item" v-if="options.register_time.is_used">
					<view class="key">注册时间{{options.register_time.type}}{{options.register_time.value}}小时</view>
					<view class="status passed" v-if="options.register_time.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed"  @tap="toCheck('register_time')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
				<view class="item" v-if="options.score.is_used">
					<view class="key">{{scoreAlias}}数量{{options.score.type}}{{options.score.value}}</view>
					<view class="status passed" v-if="options.score.is_passed">已符合</view>
					<template v-else>
						<view class="status un-passed" @tap="toCheck('score')">未符合</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</template>
				</view>
			</view>
			
			<view class="price-c">
				<text class="text">专享价:</text>
				<PriceDisplay :info="info"></PriceDisplay>
			</view>

			<view class="btn-c">
				<button class="btn cancel bg-purple" @tap="cancel">再看看</button>
				<button class="btn submit" :class="{'bg-yellow':isPassed, 'bg-gray': !isPassed}" @tap="submit">专享价购买</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				info: {},
				isPassed: 0,
				options: {},
				isInit: false,
			}
		},
		props: {
			groupPriceUuid: {
				type: String
			}
		},
		computed: {},
		watch: {},
		onLoad(e) {

		},
		created() {
			this.initOrder()
		},
		methods: {
			toCheck (type) {
				let map = {
					phone: '/pages/myProfile/index',
					vip: '/pages/buyVip/index',
					birthday: '/pages/myProfile/index',
					score: '/pages/myScore/index',
					register_time: '/pages/center/detail',
					level_score: '/pages/center/detail',
					invitee_total: '/pages/myInvitees/index'
				}
				
				let url = map[type]
				
				uni.navigateTo({
					url: url
				})
			
			},
			initOrder() {
				// this.groupPriceUuid = '6069469adc976'
				uni.showLoading()
				this.$http(`/group-prices/${this.groupPriceUuid}`).then(res => {
					this.isInit = true
					this.info = res.data.info
					this.options = res.data.options
					this.isPassed = res.data.is_passed,
					uni.hideLoading()
				})
			},
			cancel() {
				this.$emit('cancel')
			},
			submit() {
				if (!this.isPassed) {
					uni.showToast({
						title: '暂不符合购买条件~',
						icon: 'none'
					})
					return false
				}
				this.$emit('buy', this.info)
				// uni.showLoading()
				// this.$http(`/orders/${this.uuid}/return-sale`, 'POST').then(res => {
				// 	this.isReturnSaleSuccess = 1
				// 	uni.hideLoading()
				// 	this.$emit('refresh')
				// })
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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mask-content {
		width: 600rpx;
		// height: 680rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 20rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 60rpx 60rpx 50rpx 60rpx;
		box-sizing: border-box;
		position: relative;

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
		}
		
		.desc {
			font-size: 26rpx;
			color: #999;
			margin: 30rpx 0rpx 50rpx 0rpx;
			text-align: justify;
		}

		.rule-c {
			.item {
				display: flex;
				align-items: center;
				margin-bottom: 14rpx;
				// margin-right: -10rpx;
				.key {
					flex-grow: 1;
					font-size: 28rpx;
				}
				.status {
					font-weight: 500;
					font-size: 26rpx;
					
					&.un-passed {
						color: red;
					}
					&.passed {
						color: #2BA246;
					}
				}
				.icon-arrow-right {
					font-size: 40rpx;
					color: #999;
					margin-right: -10rpx;
				}
			}
		}
		
		.price-c {
			display: flex;
			justify-content: flex-end;
			color: red;
			text-align: right;
			margin-top: 50rpx;
		}

		.btn-c {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn {
				padding: 0;
				margin: 50rpx 0rpx 0rpx 0rpx;
				width: 46%;
				border-radius: 20rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				background-color: #ffcc00;
				// box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
				color: white;

				&:after {
					border: none;
				}

				&.submit {}
			}
		}
	}
</style>
