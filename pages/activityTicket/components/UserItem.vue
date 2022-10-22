<template>
	<view class="item" :key="info.uuid" @tap="handleClick">
		<template v-if="info.user">
			<image class="left headimg" :src="info.user.headimg"></image>
			<view class="right">
				<view class="top">
					<view class="name">{{info.user.name}}</view>
					<view class="time">{{$tool.formatDate(info.created_at, 'MM/dd hh:mm')}} NO.{{info.node_invite_index}}</view>
				</view>
				<view class="bottom">
					<!-- <view class="index">NO.{{info.node_invite_index}} </view> -->
					<span v-if="info.status === 0">待发放</span>
					<SingleRewardDisplay :info="info.node_reward" v-else></SingleRewardDisplay>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		async onLoad() {},
		methods: {
			handleClick () {
				if (this.info.node_reward.type === 'score') {
					uni.navigateTo({
						url: '/pages/myScore/index'
					})
				}
				else if (this.info.node_reward.type === 'redpack') {
					uni.navigateTo({
						url: '/pages/myRedpack/index'
					})
				}
				else if (this.info.node_reward.type === 'exclude_card' || this.info.node_reward.type === 'show_card') {
					uni.navigateTo({
						url: '/pages/myCard/index'
					})
				}
				else if (this.info.node_reward.type === 'coupon') {
					uni.navigateTo({
						url: '/pages/myCoupons/index'
					})
				}
			}
		},
		filters: {}
	}
</script>
<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 10px;
		margin: 10px;
		background: white;
		border-radius: 6rpx;
		align-items: center;
		border-bottom: 1rpx solid #f1f1f1;

		.left {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 18rpx;
		}
		.right {
			flex-grow: 1;
		}

		.top {
			
			display: flex;
			justify-content: space-between;
			align-items: center;

			.name {
				font-weight: 700;
			}

			.time {
				color: gray;
				font-size: 26rpx;
			}
		}

		.bottom {
			display: flex;
			justify-content: flex-end;
			// text-align: right;
			.number {
				color: red;
				font-size: 45rpx;
			}
			.index {
				color: gray;
				font-size: 26rpx;
			}
		}
	}
</style>
