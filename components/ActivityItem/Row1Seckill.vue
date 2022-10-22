<template>
	<view class="item-container global-shadow" :class="theme" hover-class="hover" @tap="$emit('click')">
		<view class="left-content">
			<image class="thumb" mode="aspectFill" :src="info.thumb"></image>
			<view class="expired-mask" v-if="info.union_status == 'expired'">
				<image class="mask-icon" src="@/static/end-mask.png"></image>
			</view>
		</view>
		<view class="right-content">
			<view class="title">【{{info.activity_type_text}}】{{info.title}}</view>
			<!-- <view class="sub-title" v-if="info.sub_title">{{info.sub_title}}</view> -->
			<!-- <view class="time">
				{{$tool.formatDate(info.start_at, 'MM.dd hh:mm')}} 至 {{$tool.formatDate(info.end_at, 'MM.dd hh:mm')}}
			</view> -->
			<view class="middle">
				<!-- <view class='stock'>剩{{info.stock}}份</view> -->
				<CountDown :start="info.start_at" :end="info.end_at"></CountDown>
				<view class='stock'>剩{{info.stock}}份</view>
			</view>
			<view class="bottom">
				<!-- <CountDown :start="info.start_at" :end="info.end_at"></CountDown> -->
				<view class="left">
					<!-- <view>剩{{info.stock}}份</view> -->
					<!-- <view v-else-if="info.type == 'offline'" class="city">{{info.city}}</view>
					<view v-else-if="info.type == 'live'" class="live-platform">{{info.live_platform}}</view> -->
					<!-- <view class="price-c">
						<PriceDisplay :info="info"></PriceDisplay>
					</view> -->
				</view>
				<view class="right">
					<view class="price-c">
						<PriceDisplay :info="info"></PriceDisplay>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			},
			tag: {
				type: String
			},
			theme: {
				type: String
			}
		},
		data() {
			return {}
		},
		methods: {
			// toDetail () {
			// 	this.$emit('toDetail')
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.item-container {
		// width: 600rpx;
		height: 216rpx;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		// overflow: hidden;
		background: white;
		margin: 20rpx 0rpx 20rpx 0rpx;
		position: relative;
		


		display: flex;
		// border: 1px solid red;
		
		border-top: 1rpx solid #fafafa;


		.left-content {
			position: relative;
			width: 220rpx;
			height: 220rpx;
			flex: 0 0 232rpx;
			border-radius: 30rpx;
			top: -20rpx;
			margin: 0rpx 30rpx 0rpx 20rpx;
			overflow: hidden;
			.thumb {
				width: 100%;
				height: 100%;
			}
			
			.expired-mask {
				width: 100%;
				height: 100%;
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				background: rgba(0, 0, 0, 0.5);
				display: flex;
				align-items: center;
				justify-content: center;
				
				.mask-icon {
					width: 112rpx;
					height: 84rpx;
				}
			}
		}


		.right-content {
			position: relative;
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			overflow: hidden;
			.status {
				font-size: 24rpx;
				height: 52rpx;
				// border: 1px solid red;
				overflow: hidden;
				padding-right: 20rpx;
				
				&.working, &.pending {
					background: url(@/static/activity/status-bg-working.png);
					background-size: 180rpx 70rpx;
					background-repeat: no-repeat;
					background-position-x: right;
					color: white;
				}
				&.expired {
					color: rgba(153, 153, 153, 1);
					background: url(@/static/activity/status-bg-expired.png);
					background-size: 180rpx 70rpx;
					background-repeat: no-repeat;
					background-position-x: right;
				}
				
				.text {
					width: 130rpx;
					text-align: center;
					display: block;
					float: right;
					line-height: 56rpx;
					font-weight: 500;
				}
			}
			.title {
				font-weight: bold;
				color: #000000;
				line-height: 40rpx;
				font-size: 30rpx;
				min-height: 60rpx;
				padding-right: 20rpx;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.sub-title {
				font-size: 28rpx;
			}
			
			.stock {
				color: #999999;
				font-size: 26rpx;
			}
			
			.time {
				color: #999999;
				font-size: 26rpx;
			}
			
			.middle {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 2rpx;
				padding-right: 30rpx;
			}
			
			.bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #999999;
				font-size: 26rpx;
				padding-right: 30rpx;
				// position: absolute;
				// bottom: 30rpx;
				width: 100%;
				box-sizing: border-box;
				font-weight: 500;
				flex-wrap: wrap;
				margin-top: 10rpx;
				
				.price-c {
					display: flex;
					align-items: flex-end;
					color: red;
					font-size: 30rpx;
					// .price {
					// 	color: red;
					// 	font-size: 38rpx;
					// }
					// .line-price {
					// 	text-decoration: line-through;
					// 	margin-left: 10rpx;
					// 	font-size: 30rpx;
					// }
				}
				
				.lottery-total, .city, .live-platform {
					height: 36rpx;
					background: #FFFAE8;
					border-radius: 18rpx;
					padding: 0rpx 20rpx;
					box-sizing: border-box;
					line-height: 36rpx;
					color: white;
					font-size: 22rpx;
					font-weight: 500;
					color: #FFCC09;
					// flex: 0 0 110rpx;
					text-align: center;
				}
			}
		}
		
		&.theme-2 {
			overflow: hidden;
			margin: 30rpx 0rpx 20rpx 0rpx;
			.left-content {
				
				top: 0rpx;
				height: 100%;
				margin: 0rpx 20rpx 0rpx 0rpx;
				border-radius: 0rpx;
			}
		}

	}
</style>
