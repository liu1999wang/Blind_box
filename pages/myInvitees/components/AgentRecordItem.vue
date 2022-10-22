<template>
	<view class="item global-shadow-2">
		<image class="left thumb" :src="sku.thumb"></image>
		<view class="body">
			<view class="name">{{sku.title}}</view>
			<view class="time">
				{{user.name}} 购买于 {{$tool.formatDate(info.created_at, 'MM-dd hh:mm')}}
			</view>
		</view>
		<view class="right">
			<span class="plus">+</span>
			<temaplte v-if="info.score">
				<span class="number">{{info.score}}</span>
				<span class="type">{{scoreAlias}}</span>
			</temaplte>
			<temaplte v-else-if="info.money">
				<span class="number">￥{{$tool.formatPrice(info.money)}}</span>
				<!-- <span class="type">红包</span> -->
			</temaplte>
		</view>
		
		<view class="status" :class="'status-' + info.union_status">{{info.union_status_text}}</view>
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
		computed: {
			sku () {
				return this.info.order_sku || {}
			},
			user () {
				return this.info.order_user || {}
			}
		},
		async onLoad() {},
		methods: {},
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
		position: relative;

		.left {
			width: 100rpx;
			height: 100rpx;
			flex: 0 0 100rpx;
			border-radius: 10%;
			margin-right: 18rpx;
		}

		.body {
			flex-grow: 1;

			.name {
				font-weight: 700;
			}

			.time {
				color: gray;
				font-size: 26rpx;
			}
		}

		.right {
			width: 160rpx;
			flex: 0 0 160rpx;
			text-align: right;
			.plus {
				color: red;
			}

			.number {
				color: red;
				font-size: 32rpx;
			}
		}
		
		.status {
			position: absolute;
			right: 4rpx;
			top: 4rpx;
			border-radius: 20rpx;
			color: white;
			font-weight: 500;
			background: #bbb;
			padding: 2rpx 10rpx;
			font-size: 20rpx;
			
			&.status-pending {
				
			}
			
			&.status-completed {
				background: #00B26A;
			}
			
			&.status-closed {
				background: #F27233;
			}
		}
	}
</style>
