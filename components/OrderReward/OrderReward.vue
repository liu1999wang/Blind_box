<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated bounceInLeft" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">{{info.title}}</view>
			
			<view class="desc">
				下订支付后即赠送以下礼包:
			</view>
			<view class="rule-c">
				<view class="item" v-if="info.is_score">
					<view class="key">积分</view>
					<view class="status">x{{info.score}}</view>
				</view>
				<view class="item" v-if="info.is_level_score">
					<view class="key">成长值</view>
					<view class="status">x{{info.level_score}}</view>
				</view>
				<view class="item" v-if="info.is_redpack">
					<view class="key">红包</view>
					<view class="status">￥{{info.redpack / 100}}</view>
				</view>
				<view class="item" v-if="info.is_show_box_card">
					<view class="key">透视卡</view>
					<view class="status">x{{info.show_box_card}}</view>
				</view>
				<view class="item" v-if="info.is_exclude_box_card">
					<view class="key">排除卡</view>
					<view class="status">x{{info.exclude_box_card}}</view>
				</view>
			</view>
			
			<view class="desc">
				订单支付成功后礼包即时到帐，商品不可申请退货
			</view>
			
			<!-- <view class="price-c">
				<text class="text">专享价:</text>
				<PriceDisplay :info="info"></PriceDisplay>
			</view>

			<view class="btn-c">
				<button class="btn cancel bg-purple" @tap="cancel">再看看</button>
				<button class="btn submit" :class="{'bg-yellow':isPassed, 'bg-gray': !isPassed}" @tap="submit">专享价购买</button>
			</view> -->
			
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		watch: {},
		onLoad(e) {

		},
		created() {
			// this.initOrder()
		},
		methods: {
			cancel() {
				this.$emit('cancel')
			},
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
