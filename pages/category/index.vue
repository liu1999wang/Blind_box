<template>
	<view class="container">
		<scroll-view class="left">
			<!-- <view class="item" :class="{actived: currentCategoryId == 'ip'}" @tap="currentCategoryId = 'ip'">IP分类</view> -->
			<view class="item" :class="{actived: currentCategoryId == item.id}" @tap="currentCategoryId = item.id" v-for="(item, index) in categoryList">
				{{item.title}}
			</view>
		</scroll-view>
		<view class="right">
			<view class="item"  v-for="(item, index) in rightList" hover-class="hover" @tap="toList(item)">
				<image mode="aspectFill" :src="item.thumb" class="thumb"></image>
				<view class="title">{{item.title}}</view>
			</view>
			<NoData v-if="!rightList.length"></NoData>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				ipList: [],
				categoryList: [],
				currentCategoryId: 'ip',
				isShowIPList: false
			}
		},
		computed: {
			rightList () {
				if (this.currentCategoryId == 'ip') {
					return this.ipList
				}
				else {
					let obj = this.categoryList.find(item => {
						return item.id == this.currentCategoryId
					})
					return obj ? obj.sub_categories : []
				}
			}
		},
		async onLoad(e) {
			this.currentCategoryId = e.category_id
			
			this.$http('/ip/categories').then(res => {
				this.ipList = res.data.list
			})
			
			this.$http('/normal/categories').then(res => {
				this.categoryList = res.data.list
				
				if (typeof(this.currentCategoryId) != Number && res.data.list.length > 0) {
					this.currentCategoryId = res.data.list[0].id
				}
			})
			
			// this.currentCategoryId = e.category_id || 'ip'
			
			this.$visitor.record('category');
		},
		methods: {
			toList (item) {
				uni.navigateTo({
					url: `/pages/search/index?type=all&category_id=${item.id}&title=${item.title}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
	}
</style>

<style lang="scss" scoped>
	.container {
		padding-left: 200rpx;
	}
	.left {
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		height: 100%;
		width: 200rpx;
		background: #F5F6FB;
		.item {
			text-align: center;
			padding: 26rpx 10rpx;
			border-left: 8rpx solid #F5F6FB;
			font-size: 28rpx;
			&.actived {
				border-left: 8rpx solid #FBD57E;
				background: white;
				font-weight: bold;
				font-size: 30rpx;
			}
		}
	}
	.right {
		width: 100%;
		height: 100%;
		background: white;
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-between;
		padding: 10rpx 0rpx;
		box-sizing: border-box;
		
		.item {
			width: 160rpx;
			margin-bottom: 30rpx;
			margin-left: 18rpx;
			.thumb {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
			}
			.title {
				font-size: 28rpx;
				text-align: center;
				width: 160rpx;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
		}
	}
</style>