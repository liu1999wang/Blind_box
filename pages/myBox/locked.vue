<template>
	<view class="container">
		<!-- <view class="header-tabs">
			<view class="tab-item" v-for="(item, index) in typeTextList" :class="{active:current==index}"
				:data-current="index" @tap="currentChange">
				<text class="text">
					{{item}}
					<template v-if="statusTotal[types[index]]">{{statusTotal[types[index]]}}</template>
				</text>
			</view>
		</view> -->

		<view class="swiper-wrapper">
			<swiper :current="current" @change="currentChange2">
				<swiper-item v-for="(item, index) in types" :key="index">
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<view class="order-list">
							<PackageSku @check="checkItem(order)" :selectType="selectType" :isSelectMode="isSelectMode"
								@refresh="refresh()"
								:isSelected="selectedIds.indexOf(order.id) > -1" v-for="order in dataList[index].list"
								:order="order" :key="order.uuid" @action="actions"></PackageSku>
							<view class="load-more margin-v" v-if="dataList[index].list.length < dataList[index].total">
								加载中...</view>
							<NoData v-if="dataList[index].init&&!dataList[index].list.length" tips="无订单"></NoData>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
	</view>
</template>

<script>
	import PackageSku from "./components/PackageSku.vue";
	export default {
		components: {
			PackageSku,
		},
		data() {
			return {
				order: {},
				reasons: [],
				visible: false,
				dataList: [],
				current: 0,
				currentUuid: '6056e83ef3251',
				currentItem: {},
				types: ["locked"],
				typeTextList: ['锁定中'],
				isSelectMode: false,
				selectType: 'deliver',
				selectedIds: [],
				isShowPay: false,
				isShowReturnSalePopup: false,
				isShowResalePopup: false,
				statusTotal: {},
				isReturnSaleSuccess: false
			}
		},
		computed: {
			orderConfig() {
				return this.$store.getters.setting.order || {}
			},
			marketConfig() {
				return this.$store.getters.setting.market || {}
			},
			exchangeConfig() {
				return this.$store.getters.setting.exchange || {}
			}
		},
		onLoad(e) {
			this.current = this.types.indexOf(e.status || 'locked')
			this.initData()
		},
		onShow() {
			this.refresh()
		},
		onUnload() {
			// uni.$off('postCommentSuccess', data => {
			// 	console.log('移除postCommentSuccess 自定义事件');
			// })
		},
		methods: {
			hideResalePopup() {
				this.isShowResalePopup = false
			},
			toPage(url) {
				uni.navigateTo({
					url: url
				})
			},
			successDeliver() {
				this.cancelSelect()
				this.current = 2
				this.refresh()
				this.isShowPay = false
				uni.showModal({
					title: '发货成功',
					content: '已成功提交发货请求，请注意查收快递哦~'
				})
			},
			selectAll() {
				if (!this.dataList[0]) {
					return false
				}
				this.selectedIds = []
				for (let i = 0; i < this.dataList[0].list.length; i++) {
					let item = this.dataList[0].list[i]

					if (this.selectType === 'deliver') {
						if (item.sku_type_text !== 'virtual_asset' && !item.is_presell) {
							this.selectedIds.push(item.id)
						}
					} else if (this.selectType === 'return_sale') {
						if (!this.orderConfig.is_ban_return_sale && (item.sku_type_text != 'virtual_asset') && item
							.is_return_saleable) {
							this.selectedIds.push(item.id)
						}
					} else if (this.selectType === 'resale') {
						if (item.sku_type_text != 'virtual_asset') {
							this.selectedIds.push(item.id)
						}
					}

				}
			},
			cancelSelect() {
				this.isSelectMode = false
				this.selectedIds = []
			},
			selectOrSubmit() {
				if (!this.isSelectMode) {
					this.isSelectMode = true
				} else {
					if (this.selectedIds.length == 0) {
						uni.showModal({
							title: '请选择物品',
							content: '选择一件或多件物品后才能提交发货哦~'
						})
						return false
					}

					this.isShowPay = true
				}
			},
			// 批量回收
			batchReturnSale() {
				if (this.selectedIds.length == 0) {
					uni.showModal({
						title: '请选择物品',
						content: '选择一件或多件物品后才能回收哦~'
					})
					return false
				}

				uni.showModal({
					title: '确认回收',
					content: '确认要批量回收吗?',
					success: (res) => {
						
						if (res.confirm)  {
							uni.showLoading({
								title: '回收中...'
							})
							this.$http(`/asset/return-sale/confirm`, 'post', {
								ids: this.selectedIds
							}).then(res => {
								this.isReturnSaleSuccess = 1
								uni.hideLoading()
								this.refresh()
								this.isSelectMode = false
								// this.$emit('refresh')
							})
						}
					}
				})
			},
			// 批量转售
			batchResale() {
				if (this.selectedIds.length == 0) {
					uni.showModal({
						title: '请选择物品',
						content: '选择一件或多件物品后才能挂售哦~'
					})
					return false
				}

				uni.showModal({
					title: '确认挂售到交易市场',
					content: '统一以建议挂售价挂售到交易市场',
					success: (res) => {
						
						if (res.confirm)  {
							uni.showLoading({
								title: '挂售中...'
							})
							this.$http(`/market/resale/batch/confirm`, 'post', {
								ids: this.selectedIds
							}).then(res => {
								// this.isReturnSaleSuccess = 1
								uni.hideLoading()
								this.refresh()
								this.isSelectMode = false
								
								uni.showToast({
									title: '转售成功，即将跳转~',
									icon: 'none'
								})
								
								setTimeout(res => {
									uni.navigateTo({
										url: '/pages/resale/index'
									})
								}, 1500)
								// this.$emit('refresh')
							})
						}
					}
				})
			},
			// 进入置换模式
			batchExchange() {
				if (this.selectedIds.length == 0) {
					uni.showModal({
						title: '请选择物品',
						content: '选择一件或多件物品后才能置换哦~'
					})
					return false
				}
				
				if (this.selectedIds.length >= 10) {
					uni.showModal({
						title: '超出限制了',
						content: '单次置换限制在10件以内~'
					})
					return false
				}
				
				this.setStorage('exchange_package_sku_ids', this.selectedIds)
				
				uni.navigateTo({
					url: '/pages/exchange/productList'
				})
			},
			enterSelectMode(type) {
				this.selectedIds = []
				this.isSelectMode = true
				this.selectType = type
			},
			checkItem(order) {
				let index = this.selectedIds.indexOf(order.id)
				if (index > -1) {
					this.selectedIds.splice(index, 1)
				} else {
					this.selectedIds.push(order.id)
				}
			},
			refresh() {
				this.cleanData()
				this.getOrderList()

				this.initBoxTotalData()
			},
			scrolltolower() {
				this.dataList[this.current].page++
				this.getOrderList()
			},
			initData() {
				let dataList = []
				this.types.forEach(item => {
					dataList.push({
						list: [],
						type: item,
						page: 1,
						per_page: 50,
						total: 0,
						init: false,
						loading: false
					})
				})
				this.dataList = dataList
			},
			cleanData() {
				this.dataList.forEach(item => {
					item.page = 1
					item.init = false
				})
			},
			initBoxTotalData() {
				this.$http('/status-total/package-sku').then(res => {
					this.statusTotal = res.data.info
				})
			},
			visibleChange() {
				this.visible = !this.visible
			},
			actions(e) {
				switch (e.action) {
					case '返售':
						this.currentUuid = e.order.uuid
						this.currentItem = e.order
						this.isShowReturnSalePopup = true
						break;
					case '核销码':
						uni.navigateTo({
							url: '/pages/orderCode/index?uuid=' + e.order.uuid
						})
						break;
					case '查看订单':
						uni.navigateTo({
							url: '/pages/orderDetail/index?uuid=' + e.order.pick_order.uuid
						})
						break;
					case '转售':
						this.currentUuid = e.order.uuid
						this.currentItem = e.order
						this.isShowResalePopup = true
						break;
					default:
						break;
				}
			},
			currentChange(e) {
				let index = e.currentTarget.dataset.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					if (!itemList.init) {
						this.getOrderList()
					}
				}
			},
			currentChange2(e) {
				let index = e.detail.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					if (!itemList.init) {
						this.getOrderList()
					}
				}
			},
			getOrderList() {
				let itemList = this.dataList[this.current]
				if (itemList.loading) return
				// if (!itemList.init) {
				// 	uni.showLoading({
				// 		title: '加载中',
				// 		mask: true
				// 	})
				// }
				itemList.loading = true
				this.$http('/asset/package-skus', 'GET', {
					status: itemList.type,
					page: itemList.page,
					per_page: itemList.per_page
				}).then(res => {
					// uni.hideLoading()
					itemList.loading = false

					if (res.data.current_page === 1) {
						itemList.list = res.data.list
					} else {
						itemList.list.push(...res.data.list)
					}

					itemList.total = res.data.item_total
					itemList.init = true
				})
				// this.$api.emit('order.list', {
				// 	status: itemList.type,
				// 	page: itemList.page,
				// 	per_page: itemList.per_page
				// }).then(res => {
				// 	uni.hideLoading()
				// 	itemList.loading = false
				// 	itemList.list.push(...res.data.list)
				// 	itemList.total = res.data.item_total
				// 	itemList.init = true
				// })
			}
		}
	}
</script>

<style lang="scss">
	.locked-float-btn {
		background: #FEEF5C;
		color: black;
		position: fixed;
		right: 0rpx;
		top: 500rpx;
		padding: 20rpx 10rpx 20rpx 30rpx;
		text-align: center;
		border-radius: 60rpx 0rpx 0rpx 60rpx;
		font-size: 26rpx;
		min-width: 60rpx;
		.icon-lock {
			font-size: 30rpx;
		}
	}
	button {
		padding: 0;
		margin: 0;
		// margin-left: 20upx;
		// width: 150upx;
		// height: 50upx;
		line-height: 50upx;
		font-size: 24upx;
		border-radius: 1000px;
		position: relative;

		&.bg-white {
			box-shadow: 0 2upx 8upx #cfcfcf;
		}

		&:after {
			border: none;
		}
	}

	.footer-c {
		position: fixed;
		bottom: 30rpx;
		width: 100%;
		left: 0rpx;
		padding: 0rpx 30rpx;
		display: flex;
		box-sizing: border-box;
	}

	.select-box-btn {
		font-size: 28rpx;
		flex-grow: 1;
		padding: 16rpx 0rpx;
		text-align: center;
	}

	.enter-btn {
		&:nth-child(2) {
			margin-left: 60rpx;
		}
	}

	.cancel-btn {
		width: 150rpx;
		flex: 0 0 150rpx;
		margin-right: 20rpx;
		padding: 16rpx 0rpx;
		text-align: center;
	}

	.select-all {
		width: 150rpx;
		flex: 0 0 150rpx;
		margin-right: 20rpx;
		padding: 16rpx 0rpx;
		text-align: center;
	}

	.header-tabs {
		width: 100%;
		height: 90rpx;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		background-color: #ffffff;

		.tab-item {
			flex: 1;
			line-height: 90rpx;
			text-align: center;
			font-size: 28rpx;
			color: rgba(198, 198, 198, 1);
			font-weight: 500;

			&.active {
				color: rgba(51, 51, 51, 1);
				position: relative;
				font-weight: 500;

				.text {
					border-bottom: 6rpx solid rgba(51, 51, 51, 1);
					padding: 0rpx 0rpx 4rpx 0rpx;
				}

				// &::after {
				// 	content: "";
				// 	position: absolute;
				// 	height: 2px;
				// 	left: 20rpx;
				// 	right: 20rpx;
				// 	bottom: 0;
				// 	background-color: #0E151D;
				// }
			}
		}
	}

	.swiper-wrapper {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
		// padding-top: 90rpx;
		background-color: white;

		swiper,
		scroll-view {
			width: 100%;
			height: 100%;

			.order-list {
				overflow: hidden;
				padding: 0rpx 30rpx 160rpx 30rpx;

				.load-more {
					height: 100rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 32rpx;
					color: #888;
				}
			}
		}
	}

	.mask {

		display: flex;
		align-items: center;
		justify-content: center;


		.mask-content {
			width: 660rpx;
			// height: 680rpx;
			background-color: #EDEDED;
			background-color: white;
			border-radius: 20rpx;
			// display: flex;
			// flex-direction: column;
			// align-items: center;
			// animation: show 0.8s;
			padding: 60rpx 60rpx 50rpx 60rpx;
			box-sizing: border-box;
			position: relative;

			.close-btn {
				position: absolute;
				right: 26rpx;
				top: 26rpx;

				color: #999;
			}

			.title {
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
			}

			.icon-check {
				color: #2BA246;
				font-size: 46rpx;
				position: relative;
				top: 4rpx;
				margin-right: 10rpx;
			}

			.btn-c {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.btn {
					padding: 0;
					margin: 50rpx 0rpx 0rpx 0rpx;
					width: 46%;
					border-radius: 20rpx;
					height: 86rpx;
					line-height: 86rpx;
					text-align: center;
					font-size: 30rpx;
					font-weight: bold;
					background-color: #ffcc00;
					// box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
					color: white;

					&:after {
						border: none;
					}

					&.submit {}
				}
			}
		}
	}
</style>
