<template>
	<view class="title-container" :style="cssStyle">
		<image v-if="leftIcon" class="icon" :src="leftIcon"></image>
		<view v-else class="color-line"></view>
		<view class="text">
			<!-- <view class="en">
				ALL NEWS
			</view> -->
			{{title}}
		</view>
		<view class="more-btn" v-if="isShowMore" @tap="more" hover-class="hover">
			<text>{{ moreText || '更多'}}</text>
			<!-- <text class="icon new-iconfont icon-arrow-right"></text> -->
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default () {
					return ''
				}
			},
			leftIcon: {
				type: String,
				default () {
					return ''
				}
			},
			cssStyle: {
				type: String
			},
			isShowMore: {
				type: Boolean | Number,
				default: () => {
					return false
				}
			},
			link: {
				type: Object | Array | String,
				default () {
					return {}
				}
			},
			moreText: {
				type: String,
				default () {
					return ''
				}
			}
		},
		methods: {
			more () {
				if (typeof this.link === 'string') {
					uni.navigateTo({
						url: this.link
					})
				}
				else {
					this.toLink(this.link)
				}
				// this.toLink(this.link)
				// this.$emit('more')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-container {
		// border: 1px solid red;
		// background: url('@/static/new-list-title.png');
		background-size: 402rpx auto;
		background-repeat: no-repeat;
		// padding-top: 10rpx;
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
		
		margin: 30rpx 0rpx 20rpx 0rpx;
		display: flex;
		align-items: center;
		
		.icon {
			width: 34rpx;
			height: 34rpx;
			margin-right: 10rpx;
		}
		
		.color-line {
			height: 38rpx;
			width: 10rpx;
			background: #FECC09;
			padding-bottom: 2rpx;
			margin-right: 10rpx;
			border-radius: 4rpx;
		}
		
		.text {
			flex-grow: 1;
			// position: relative;
			.en {
				font-size: 36rpx;
				font-weight: 800;
				color: #F9E9AD;
				position: absolute;
				top: -20rpx;
				left: 6rpx;
				z-index: 0;
				
				color: linear-gradient(#F9E9AD, rgba(255, 255, 255, 0.1));
			}
		}
	}
</style>
