<template>
	<view class="sort-types" :class="{'padding-right': paddingRight}">
		<view class="type-item" :class="{actived: type === 'sale'}">
			<IPicker v-model="itemType" :list="itemTypeList"></IPicker>
			<!-- <view class="mark-c">
				<view :class="{mark: true, up: true, active: sort==='sale_asc'}"></view>
				<view :class="{mark: true, down: true, active: sort==='sale_desc'}"></view>
			</view> -->
		</view>
		<!-- <view class="type-item" :class="{actived: type === 'hot'}" @tap="setSort('hot')">
			<text>综合</text>
		</view> -->
		<view class="type-item" :class="{actived: type === 'time'}" @tap="setSort('time')">
			<text>新品</text>
			<!-- <view class="mark-c">
				<view :class="{mark: true, up: true, active: sort==='time_asc'}"></view>
				<view :class="{mark: true, down: true, active: sort==='time_desc'}"></view>
			</view> -->
		</view>
		<view class="type-item" :class="{actived: type === 'price'}" @tap="setSort('price')">
			<text>价格</text>
			<view class="mark-c">
				<view :class="{mark: true, up: true, active: sort==='price_asc'}"></view>
				<view :class="{mark: true, down: true, active: sort==='price_desc'}"></view>
			</view>
		</view>
		<view class="type-item" @tap="toCategoryPage">
			<text>找分类</text>
		</view>
		<!-- <view class="type-item category-drawer" @tap="showDrawer">
			<text>分类</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			paddingRight: {
				type: Boolean,
				default: () => {
					return true
				}
			},
			defaultItemType: {
				type: String
			}
		},
		data() {
			return {
				sort: '',
				type: 'hot',
				itemType: 'all',
				itemTypeList: [
					{
						label: '搜全部',
						key: 'all'
					},
					{
						label: '搜盲盒',
						key: 'box'
					},
					{
						label: '搜商品',
						key: 'product'
					},
					// {
					// 	label: '搜活动',
					// 	key: 'activity'
					// },
				]
			}
		},
		watch: {
			itemType () {
				this.$emit('setType', this.itemType)
			}
		},
		mounted () {
			this.itemType = this.defaultItemType
		},
		methods: {
			toCategoryPage () {
				uni.navigateTo({
					url: '/pages/category/index'
				})
			},
			setSort(type) {
				this.type = type
				
				if (type === 'time' || type === 'sale') {
					this.sort = type + '_desc'
					this.$emit('setSort', this.sort)
					return false
				}
					
				
				let desc = type + '_desc'
				let asc = type + '_asc'
				this.sort = this.sort === desc ? asc : desc
				this.$emit('setSort', this.sort)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mark-c {
		margin-left: 4rpx;
		.mark {
			width: 0px;
			height: 0px;
		}
		.up {
		    border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-bottom: 5px solid #d1d1d1;
			&.active {
				border-bottom: 5px solid #777;
			}
		}
		
		.down {
			margin-top: 5rpx;
		    border-left: 5px solid transparent;
		    border-right: 5px solid transparent;
		    border-top: 5px solid #e1e1e1;
			&.active {
				border-top: 5px solid #999;
			}
		}
	}
	
	.sort-types {
		display: flex;
		justify-content: space-between;
		padding-left: 50rpx;
		
		&.padding-right {
			padding-right: 50rpx;
		}

		.type-item {
			height: 84upx;
			// width: 20%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
			font-weight: 500;
			
			&.actived {
				color: #016AFF;
			}

			&.category-drawer {
				color: #F56C6C;
			}
		}
	}
</style>
