<template>
	<view class="container">
		<view class="header">
			<SortBar @setSort="setSort" @setType="setType" :defaultItemType="itemType" v-if="isShowSortBar"></SortBar>
			<!-- <view class="guess-title" v-else>猜你喜欢</view> -->
		</view>

		<view class="product-list" v-if="isShowSortBar">
			<ProductList :list="list"></ProductList>
			<NoMore></NoMore>
		</view>
		<view class="product-list guest-list" v-else>
			<view class="guess-title">猜你喜欢</view>
			<ProductList :list="guessList"></ProductList>
		</view>
		<NoData v-if="init&&!list.length"></NoData>

		<!-- <uni-drawer :visible="visible" mode="right" @close="drawerClose">
			<view class="category-wrapper">
				<view class="category-item-wrapper" v-for="(item,index) in category" :key="item.id">
					<view :class="{level1: true, actived: activeCategory == item.id}" :data-index="index" @tap="handleChange">
						<text class="text">{{item.title}}</text>
						<text class="icon">{{item.openSubCategory?"-":"+"}}</text>
					</view>
					<view class="level2" v-if="item.openSubCategory">
						<view class="level2-item" :class="{'bg-red':activeCategory==sub.id}" v-for="sub in item.sub_categories" :key="sub.id"
						 :data-id="sub.id" @tap="activeChange">{{sub.title}}</view>
					</view>
				</view>
			</view>
		</uni-drawer> -->
	</view>
</template>

<script>
	// import {
	// 	uniDrawer
	// } from '@dcloudio/uni-ui'
	import ProductList from "./components/list.vue"
	import mixin from "@/utils/mixin.js"
	import SortBar from "./components/sortBar.vue"
	export default {
		mixins: [mixin],
		components: {
			// uniDrawer,
			ProductList,
			SortBar
		},
		data() {
			return {
				sort: '',
				key: '',
				visible: false,
				category: [],
				list: [],
				page: 1,
				per_page: 20,
				total: 0,
				activeCategory: '',
				init: false,
				title: '全部商品',
				action: '',
				itemType: 'all',
				loading: false
			}
		},
		computed: {
			isShowSortBar() {
				if (this.action === 'search' && !this.key)
					return false 
					
				return true
			},
			guessList() {
				return this.list.slice(0, 6)
			}
		},
		watch: {
			key (val) {
				this.page = 1
				this.list = []
				this.getProductList()
			},
			sort (val) {
				this.page = 1
				this.list = []
				this.getProductList()
			},
			itemType (val) {
				this.page = 1
				this.list = []
				this.getProductList()
			}
		},
		onLoad(e) {
			this.activeCategory = e.category_id || 0
			this.title = e.title 
			this.action = e.action
			this.itemType = e.type || 'all'
			
			// 有分类
			if (this.activeCategory && !this.title) {
				this.$http('/categories/' + this.activeCategory).then(res => {
					this.title = res.data.info.title
					
					uni.setNavigationBarTitle({
						title: this.title
					})
				})
			}
			else {
				uni.setNavigationBarTitle({
					title: this.title
				})
			}
			
			this.getProductList()
			
			this.$visitor.record('search');

			// this.$api.emit('category.list').then(res => {
			// 	res.data.list.forEach(item => {
			// 		item.openSubCategory = true
			// 	})
			// 	this.category = res.data.list
			// })
		},
		methods: {
			setSort (sort) {
				this.sort = sort
			},
			setType (type) {
				this.itemType = type
			},
			activeChange(e) {
				let id = e.currentTarget.dataset.id
				this.activeCategory = id == this.activeCategory ? "" : id
				this.visible = false
				this.getProductList()
			},
			handleChange(e) {
				let index = e.currentTarget.dataset.index
				let item = this.category[index]
				if (item.sub_categories.length !== 0)
					this.category[index].openSubCategory = !this.category[index].openSubCategory
				else {
					this.activeCategory = item.id
					this.visible = false
					this.getProductList()
				}
			},
			handleClick(e) {
				uni.navigateTo({
					url: "/pages/productDetail/index?uuid=" + e.uuid
				})
			},
			getProductList() {
				this.loading = true
				uni.showLoading({
					mask: true
				})
				this.$http('/search', 'POST', {
					category_id: this.activeCategory,
					page: this.page,
					key: this.key,
					sort: this.sort,
					item_type: this.itemType
				}).then(res => {
					this.init = true
					uni.hideLoading()
					this.list.push(...res.data.list)
					
					this.loading = false
					this.page ++
				})
			},
			showDrawer() {
				this.visible = true
			},
			drawerClose() {
				this.visible = false
			}
		},
		async onReachBottom() {
			if(this.loading) return
			this.getProductList()
		},
	}
</script>

<style lang="scss">
	
	.header {
		padding: 0 30upx;
		padding-top: 20upx;
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		background-color: #fff;
		// @include border-bottom;
		z-index: 100;

		.search-input-wrapper {
			height: 70upx;
			border-radius: 42upx;
			background-color: #f5f5f5;
			padding: 0 30upx;
			display: flex;
			align-items: center;
			
			.icon-search {
				margin-right: 10rpx;
				color: #B3B3B3;
			}

			input {
				background-color: transparent;
				padding: 0;
				height: 100%;
				line-height: 70upx;
			}
		}
		
		// .guess-title {
		// 	font-weight: bold;
		// 	padding: 50rpx 0rpx;
		// }
	}

	.category-wrapper {
		padding: 30upx 0upx;
		box-sizing: border-box;

		.category-item-wrapper {
			margin-bottom: 10upx;
			// background: green;

			.level1 {
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0px 30rpx;

				.text {
					font-size: 32upx;
				}

				.icon {
					font-weight: 500;
					font-size: 30upx;
				}
				margin: 0px;
				background: #fafafa;
				color: #777;
			}
			
			.actived {
				background: #f1f1f1;
				color: #666;
			}

			.level2 {
				display: flex;
				flex-wrap: wrap;

				.level2-item {
					background-color: #f5f5f5;
					margin: 16upx 12upx 8upx 0;
					font-size: 28upx;
					height: 60upx;
					line-height: 60upx;
					padding: 0 26upx;
					border-radius: 3px;
				}
			}
		}
	}

	.product-list {
		padding: 180upx 30upx 30upx 30upx;
		
		&.guest-list {
			padding-top: 130rpx;
		}
	}
	
	.guess-title {
		font-weight: bold;
		padding-bottom: 10rpx;
	}
</style>
