<template>
	<view class="header" :style="'height:'+customBar+'px'">
		<view class="home-nav" :style="contentStyle">
			<view class="nav-content">
				<image class="back-icon" @tap="goBack" src="@/static/bigBox/back.png"></image>
				<view class="title">
					{{title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String
		},
		data() {
			return {
				customBar: 64,
				contentStyle: 64
			}
		},
		computed: {
			deviceInfo() {
				return this.$store.getters.deviceInfo
			}
		},
		created() {
			this.customBar = this.deviceInfo.customBar
			this.contentStyle = `height:${this.deviceInfo.customBar}px;padding-top:${this.deviceInfo.statusBar}px;`;
		},
		methods: {
			goBack () {
				if (getCurrentPages().length == 1) {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
				else {
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.header {
		position: fixed;
		z-index: 1000;
	}
	.home-nav {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
		z-index: 10;

		.nav-content {
			padding: 0 18rpx;
			height: 100%;
			display: flex;
			align-items: center;
			// background: red;
			
			.back-icon {
				width: 34rpx;
				height: 29rpx;
				margin: 0rpx 20rpx 0rpx 20rpx;
			}
			.title {
				font-size: 42rpx;
				width: 430rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				
				font-weight: bold;
				color: rgba(0, 0, 0, 1);
			}
		}
	}

</style>
