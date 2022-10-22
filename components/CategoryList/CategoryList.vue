<template>
	<view class="category-list">
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

		<!-- <view class="item" @tap="more">
			<image src="/static/more-round.png" hover-class="hover"></image>
			<text>更多</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			refreshCounter: {
				type: Number
			},
			module: {
				type: Object
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
				let perPage = 10
			
				if (this.module.list_mode === 'custom') {
					// 自定义选择分类显示
					let ids = this.module.list || [0]
					this.$http('/normal/categories', 'GET', {
						per_page: perPage,
						level_mode: 'all',
						ids: ids
					}).then(res => {
						this.list = res.data.list
					})	
				}
				else {
					// 按排序值自动显示
					this.$http('/normal/categories', 'GET', {
						per_page: perPage
					}).then(res => {
						this.list = res.data.list
					})	
				}
			},
			handleClick(item) {
				if (item.level === 1) {
					// 一级分类跳转
					uni.navigateTo({
						url: `/pages/category/index?category_id=${item.id}&title=${item.title}`
					})
				}
				else if (item.level === 2) {
					// 二级分类跳转
					uni.navigateTo({
						url: `/pages/search/index?category_id=${item.id}&title=${item.title}`
					})
				}
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
	.category-list {
		display: flex;
		justify-content: left;
		width: 100%;
		flex-wrap: wrap;
		
		// padding: 0rpx 20rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: 20%;
			flex: 0 0 20%;
			// border: 1px solid red;
			margin-bottom: 30rpx;
			
			.ip-thumb {
				width: 126rpx;
				height: 126rpx;
				// border-radius: 50%;
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
				width: 100%;
				height: 100%;
				// border-radius: 50%;
			}
			
			.title {
				text-align: center;
				width: 130rpx;
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
				font-size: 24rpx;
				line-height: 30rpx;
			}
		}
	}
</style>
