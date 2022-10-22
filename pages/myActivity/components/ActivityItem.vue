<template>
	<view class="item-container global-shadow" :class="theme" @tap="toDetail" hover-class="hover">
		<view class="left-content">
			<image class="thumb" mode="aspectFill" :src="activity.thumb"></image>
			<view class="expired-mask" v-if="activity.union_status == 'expired'">
				<image class="mask-icon" src="@/static/end-mask.png"></image>
			</view>
		</view>
		<view class="right-content">
			<view class="status" :class="activity.union_status">
				<view class="text">{{activity.union_status_text}}</view>
				<!-- <CountDown class="text" :start="info.start_at" :end="info.end_at"></CountDown> -->
				<!-- <text v-if="info.union_status === 'working'">
					剩余 <CountDown :start="info.start_at" :end="info.end_at"></CountDown>
				</text>
				<text v-else-if="info.union_status === 'pending'">2天12时39分</text>
				<text v-else-if="info.union_status === 'expired'">活动已结束</text> -->
			</view>
			<view class="title">【{{activity.type_text}}】{{activity.title}}</view>
			<!-- <view class="time">
				{{$tool.formatDate(info.start_at, 'MM.dd hh:mm')}} 至 {{$tool.formatDate(info.end_at, 'MM.dd hh:mm')}}
			</view> -->
			<view class="bottom">
				<view class="left">
					<!-- <view v-if="info.type == 'lottery'" class="lottery-total">{{info.total}}份奖品</view>
					<view v-else-if="info.type == 'offline'" class="city">{{info.city}}</view>
					<view v-else-if="info.type == 'live'" class="live-platform">{{info.live_platform}}</view> -->
					<view class="price-c">
						<PriceDisplay :info="activity" prefix="product_" :discountPrefix="null"></PriceDisplay>
					</view>
				</view>
				<view class="right">
					{{activity.prize_total}}份
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
		computed: {
			activity () {
				return this.info.activity || {}
			}
		},
		methods: {
			toDetail() {
				if (this.activity.type == 'seckill') {
					uni.navigateTo({
						url: '/pages/productDetail/index?uuid=' + this.activity.product_uuid + "&activityId=" + this.activity.id
					})
				}
				else {
					uni.navigateTo({
						url: `/pages/${this.activity.type}Activity/detail?uuid=${this.activity.uuid}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-container {
		// width: 600rpx;
		height: 232rpx;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		// overflow: hidden;
		background: white;
		margin: 70rpx 0rpx 20rpx 0rpx;
		position: relative;


		display: flex;
		// border: 1px solid red;
		
		border-top: 1rpx solid #fafafa;


		.left-content {
			position: relative;
			width: 200rpx;
			height: 242rpx;
			flex: 0 0 232rpx;
			border-radius: 30rpx;
			top: -40rpx;
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
			.status {
				font-size: 24rpx;
				height: 68rpx;
				overflow: hidden;
				padding-right: 20rpx;
				
				&.working, &.pending {
					background: url(../../../static/activity/status-bg-working.png);
					background-size: 180rpx 70rpx;
					background-repeat: no-repeat;
					background-position-x: right;
					color: white;
				}
				&.expired {
					color: rgba(153, 153, 153, 1);
					background: url(../../../static/activity/status-bg-expired.png);
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
				padding-right: 20rpx;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.time {
				color: #999999;
				font-size: 26rpx;
			}
			
			.bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #999999;
				font-size: 26rpx;
				padding-right: 30rpx;
				position: absolute;
				bottom: 30rpx;
				width: 100%;
				box-sizing: border-box;
				font-weight: 500;
				
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
