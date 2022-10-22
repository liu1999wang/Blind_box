<template>
	<view class="item global-shadow-2">
		<image class="left headimg" :src="info.headimg"></image>
		<view class="body">
			<view class="name">{{info.name}}</view>
			<view class="time">{{info.created_at}}</view>
		</view>
		<view class="right">
			<!-- <span class="plus">+</span>
			<temaplte v-if="info.invite_score">
				<span class="number">{{info.invite_score}}</span>
				<span class="type">{{scoreAlias}}</span>
			</temaplte>
			<temaplte v-else-if="info.invite_money">
				<span class="number">{{info.invite_money / 100}}</span>
				<span class="type">红包</span>
			</temaplte>
			<temaplte v-else>
				<span class="number">0</span>
				<span class="type">奖励</span>
			</temaplte> -->
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
	.item {
		display: flex;
		padding: 10px;
		margin: 10px;
		background: white;
		border-radius: 6rpx;
		align-items: center;

		.left {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
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
			.plus {
				color: red;
			}

			.number {
				color: red;
				font-size: 45rpx;
			}
		}
	}
</style>
