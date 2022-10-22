<template>
	<view class="list-item" :key="info.uuid">
		<view class="list-body">
			<view class="action">
				{{info.description}}
			</view>
			<view class="order-number" v-if="info.order_number">
				订单号:{{info.order_number}}
			</view>
			<view class="date-time">
				{{info.created_at}}
			</view>
		</view>
		<view class="right">
			<text class="red" v-if="info.type === 1">+{{info.total}}</text>
			<text class="gray" v-else>-{{info.total}}</text>
		</view>
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
		methods: {},
		filters: {}
	}
</script>
<style lang="scss" scoped>
	.list-item {
		display: flex;
		padding: 24rpx 0;
		border-bottom: 1px solid #f3f3f3;
	
		.order-number {
			font-size: 26rpx;
			margin-top: 6rpx;
		}

		.list-body {
			flex: 1;
		}
	
		.date-time {
			font-size: 24upx;
			margin-top: 6upx;
		}
		
		.right {
			font-size: 40upx;
		}
	}
</style>
