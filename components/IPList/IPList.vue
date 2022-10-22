<template>
	<view class="category-menu">
		<!-- <view class="item">
			<image src="/static/c1.png"></image>
			<text>ALL</text>
		</view> -->

		<view class="item" v-for="(item,index) in list" :key="index" 
		 @tap="handleClick(item)">
			<view class="ip-thumb">
				<image mode="aspectFill" hover-class="hover" :src="item.thumb + '?x-oss-process=image/resize,w_250'"></image>
			</view>
			<text class="title">{{item.title}}</text>
		</view>

		<view class="item" @tap="more">
			<image src="/static/more-round.png" hover-class="hover"></image>
			<text>更多</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			refreshCounter: {
				type: Number
			}
		},
		data () {
			return {
				list: []
			}
		},
		watch: {
			refreshCounter () {
				this.initData()
			}
		},
		mounted () {
			this.initData()
		},
		methods: {
			initData() {
				this.$http('/ip/categories', 'GET', {
					per_page: 5
				}).then(res => {
					this.list = res.data.list
				})	
			},
			handleClick(item) {
				uni.navigateTo({
					url: `/pages/search/index?category_id=${item.id}&title=${item.title}`
				})
			},
			more(e) {
				uni.navigateTo({
					url: '/pages/ip/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.category-menu {
		display: flex;
		justify-content: space-between;
		width: 100%;

		.item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			
			.ip-thumb {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
				
				&.active {
					position: relative;
					&:after {
						content: "";
						position: absolute;
						top: -2px;
						left: -2px;
						width: 100%;
						height: 100%;
						border: 2px solid #ffcc00;
						border-radius: 50%;
					}
				}
			}

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}
			
			.title {
				text-align: center;
				width: 120rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			text {
				margin-top: 10rpx;
				color: #333;
				font-weight: 500;
				font-size: 22rpx;
				line-height: 30rpx;
			}
		}
	}
</style>
