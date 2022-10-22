<template>
	<view class="time-scope-c">
		<template v-if="status !== 'expired'">
			<template v-if="time.day">
				<text class="dd">
					<span class="time-block">{{time.day}}</span>
					天
				</text>
			</template>
			<view class="time" v-if="time.hour">
				<span class="time-block">{{time.hour | fixNumber}}</span>时
			</view>
			<view class="time">
				<span class="time-block">{{time.minute | fixNumber}}</span>分
			</view>
			<view class="ss">
				<span class="time-block">{{time.second | fixNumber}}</span>秒后失效
			</view>
		</template>
		<view v-else>
			{{endText}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			time: {
				type: Object
			},
			status: {
				type: String
			},
			endText: {
				type: String
			}
		},
		data() {
			return {}
		},
		filters: {
			fixNumber (val) {
				if (val < 10)
					val = '0' + (val || 0) 
				return val
			}
		},
		watch: {},
		destroyed() {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
.time-scope-c {
	display: flex;
	width: 100%;
	// border: 1px solid red;
	justify-content: center;
	
	.time-block {
		background: black;
		color: white;
		padding: 4rpx 0rpx;
		border-radius: 10rpx;
		width: 50rpx;
		display: inline-block;
		margin: 0rpx 10rpx;
		text-align: center;
		font-weight: 500;
	}
}
</style>
