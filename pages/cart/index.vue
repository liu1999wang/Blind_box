<template>
	<view class="container">
		<view class="carts">
			<uni-swipe-action-item v-for="(item,index) in list" :autoClose="false" :key="item.id" >
				<view class="cart-item flex flex-vcenter">
					<view class="select-icon" :data-index="index" @tap="handleSelectedChange">
						<radio :checked="item.is_selected" color="#ffcc00" />
					</view>
					<view class="item">
						<image :src="item.sku.thumb" class="thumb" @tap="toProductPage(item)"></image>
						<view class="right">
							<view @tap="toProductPage(item)">
								<view class="category">{{item.sku.sub_title}}</view>
								<view class="title">{{item.sku.title}}</view>
								<view class="attr-c">
									{{item.sku.attrs | productAttrsToString}}
								</view>
								<view class="price-c">
									<view class="price">
										<PriceDisplay :info="item.sku"></PriceDisplay>
									</view>
								</view>
							</view>

							<view class="count-c">
								<!-- <text class="sale">销量{{item.sku.sales}}</text> -->
								<!-- <text class="origin-price" v-if="item.sku.selling_price != item.price">原价￥{{item.price / 100}}</text> -->
								<view class="buy-count">
									<IInputNumber :value="item.temp_total" size="small"
										@change.stop="totalChange($event, index)"></IInputNumber>
								</view>
							</view>
						</view>
					</view>
				</view>
				<template v-slot:right>
					<view class="right-c" @tap="deleteAction(index)"><text>删除</text></view>
				</template>
			</uni-swipe-action-item>
			<view v-if="!list.length">
				<view style="height: 1rpx;"></view>
				<NoData></NoData>
			</view>
		</view>

		<view class="footer-actions space-between flex-vcenter safe-area-bottom">
			<view class="select-all flex flex-vcenter" @tap="handleSelectedAll">
				<radio :checked="selectedAll" color="#ffcc00" />
				<text>全选</text>
			</view>
			<view class="side-right flex flex-vcenter">
				<!-- <view class="total-price-wrapper">合计: <text>¥{{totalPrice|priceToFixed}}</text></view> -->
				<view class="buy-button" @click="payByCart">
					去结算
					<PriceDisplay :info="totalPrice"></PriceDisplay>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import mixin from "../../utils/mixin.js"
	// import {
	// 	uniSwipeAction,
	// 	// uniSwipeActionItem
	// } from '@/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue'
	import IButton from "../../components/Button/index.vue";
	import IInputNumber from "../../components/InputNumber/index.vue";
	export default {
		mixins: [mixin],
		components: {
			// uniSwipeAction,
			// uniSwipeActionItem,
			IButton,
			IInputNumber
		},
		data() {
			return {
				init: false,
				list: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#F27233'
					}
				}]
			}
		},
		computed: {
			...mapGetters(['token']),
			selectedAll() {
				let selectedAll = true,
					len = this.list.length
				for (let i = 0; i < len; i++) {
					if (!this.list[i].is_selected) {
						selectedAll = false
						break
					}
				}
				return selectedAll
			},
			totalPrice() {
				let totalPrice = {
					money_price: 0,
					score_price: 0
				}
				this.list.forEach(item => {
					if (item.is_selected) {
						totalPrice.money_price += (item.sku.discount_money_price || item.sku.money_price) * item
							.total
						totalPrice.score_price += (item.sku.discount_score_price || item.sku.score_price) * item
							.total
					}
				})
				return totalPrice
			}
		},
		onLoad() {
			this.$visitor.record('cart');
		},
		onShow() {
			if (this.token) {
				if (!this.init) {
					uni.showLoading({
						title: "加载中"
					})
				}
				this.$api.emit('product.cart.index').then(res => {
					uni.hideLoading()
					this.init = true;
					res.data.list.forEach(item => {
						item.is_selected = item.is_selected ? item.is_selected : false
						item.temp_total = item.total
					})
					this.list = res.data.list
				})
			}
		},
		methods: {
			toProductPage(item) {
				uni.navigateTo({
					url: '/pages/productDetail/index?uuid=' + item.sku.product.uuid
				})
			},
			gotoProductDetail(e) {
				let index = e.currentTarget.dataset.index
				uni.navigateTo({
					url: '/pages/productDetail/index?uuid=' + this.list[index].sku.product.uuid
				})
			},
			payByCart() {
				let skus = []
				this.list.forEach(item => {
					if (item.is_selected) {
						skus.push({
							id: item.sku.id,
							total: item.total
						})
					}
				})
				if (skus.length) {
					uni.navigateTo({
						url: "/pages/orderPreview/index?skus=" + JSON.stringify(skus) + '&_source=cart'
					})
				}
			},
			deleteAction(index) {
				let item = this.list[index]
				// this.list.splice(index, 1)
				uni.showLoading({
					'title': '删除中'
				})
				this.$http("/cart-items/" + item.uuid, 'DELETE').then(res => {
					this.list.splice(index, 1)
					uni.hideLoading()
				})
			},
			totalChange(e, index) {
				if (e === this.list[index].total) return
				this.list[index].total = e
			},
			selectIconType(status) {
				return status ? "success" : "circle"
			},
			selectIconColor(status) {
				return status ? "#303133" : ""
			},
			handleSelectedChange(e) {
				let index = e.currentTarget.dataset.index
				this.list[index].is_selected = !this.list[index].is_selected
			},
			handleSelectedAll() {
				let flag = !this.selectedAll
				this.list.forEach(item => {
					item.is_selected = flag
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: white;
		/* #ifdef MP-ALIPAY */
		padding-top: 130rpx;
		/* #endif */
	}
	.carts {
		padding-bottom: 100rpx;

		padding: 0rpx 0rpx;

		padding-bottom: 100rpx;
	}
	
	.right-c {
		background: red;
		width: 100%;
		height: 100%;
		width: 160rpx;
		flex: 0 0 160rpx;
		text-align: center;
		display: flex;
		color: white;
		font-weight: 500;
		align-items: center;
		justify-content: center;
	}

	.cart-item {
		padding-left: 0;
		position: relative;
		border-bottom: 1rpx solid #F1F1F1;
		padding: 10rpx 30rpx;
		width: 100%;
		margin: 0rpx 0rpx;
		box-sizing: border-box;
		// border: 1px solid red;

		.select-icon {
			padding: 20rpx 10rpx 20rpx 0rpx;
		}

		// .thumb {
		// 	margin-left: 0rpx;
		// 	width: 200rpx;
		// 	height: 200rpx;
		// 	border-radius: 20rpx;
		// }

		.item {
			display: flex;
			width: 100%;
			padding: 36rpx 0rpx;
			// border-bottom: 1rpx solid #F1F1F1;
			position: relative;

			&.disableLine {
				border-bottom: 0rpx solid #F1F1F1;
			}

			.right {
				flex-grow: 1;
				// border: 1px solid red;
				position: relative;
			}

			.category {
				// background:rgba(241,241,241,1);
				color: #393939;
				font-size: 22rpx;
				display: inline-block;
				margin: 20rpx 0rpx 10rpx 0rpx;
				// padding: 4rpx 8rpx;
			}

			.thumb {
				width: 216rpx;
				height: 216rpx;
				margin-right: 30rpx;
				flex: 0 0 216rpx;
				border-radius: 20rpx;
			}

			.title {
				color: #393939;
				font-size: 28rpx;
				font-weight: bold;
				// min-height: 60rpx;
			}

			.attr-c {
				color: gray;
			}

			.price-c {
				display: flex;
				align-items: center;

				.price {
					color: #FF3535;
					font-weight: 500;
					margin-right: 20rpx;
					flex-grow: 1;
				}

				.origin-price {
					color: #B3B3B3;
					font-size: 24rpx;
					text-decoration: line-through;
				}

				.sale {
					color: #B3B3B3;
					font-size: 24rpx;
					margin-right: 20rpx;
				}
			}

			.count-c {
				display: flex;
				justify-content: flex-end;
			}
		}
	}

	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		box-shadow: 0 -2rpx 4rpx rgba(206, 206, 206, 0.3);
		z-index: 10;

		.select-all {
			height: 100rpx;
			display: flex;
			align-items: center;
			margin-left: 20rpx;

			text {
				margin-left: 10rpx;
			}
		}

		.buy-button {
			width: 552rpx;
			height: 78rpx;
			background: rgba(242, 114, 51, 1);
			border-radius: 39rpx;
			line-height: 78rpx;
			text-align: center;
			color: white;
		}

		.side-right {
			margin-right: 20rpx;


			.total-price-wrapper {
				margin-right: 20rpx;

				text {
					padding-left: 10rpx;
					font-size: 32rpx;
				}
			}
		}
	}
</style>
