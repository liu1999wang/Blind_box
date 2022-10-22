<template>
	<view class="container" v-if="info.id">
		
		<navigator url="/pages/resale/index">
			<view class="float-btn resale-area">
				<!-- <image mode="aspectFill" src="@/static/smallBox/my-box.png"></image> -->
				<text>挂售区</text>
			</view>
		</navigator>
		
		<view class="card-c">
			
			<view class="status-c" :class="info.union_status">{{info.union_status_text}}</view>
			<view class="user-c">
				<image  class="headimg" :src="user.headimg" mode="widthFix"></image>
				<view class="middle">
					<view class="name">
						<span>{{user && user.name}}</span>
						<span>正在出售以下商品</span>
					</view>
					<view class="last-time">{{$tool.showShortTime(info.created_at)}}发起</view>
				</view>
			</view>
			<view class="product-c">
				<template v-if="skus.length === 1">
					<image mode="aspectFit" class="thumb" :src="sku.thumb"></image>
					<view class="title">{{sku.title}} x{{sku.total}}</view>
				</template>
				<view v-else class="sku-list">
					<view class="item" v-for="sku in skus">
						<image mode="aspectFit" class="thumb" :src="sku.thumb"></image>
						<view class="title">{{sku.title}} x{{sku.total}}</view>
					</view>
				</view>
				
				<view>
					<!-- <text>数量x{{sku.total}}</text> -->
					<view  class="price-c">
						<span style="margin-right: 10px;">转让价</span> 
						<PriceDisplay :info="info"></PriceDisplay>
					</view>
				</view>
				
				<template v-if="info.union_status === 'pending'">
					<template v-if="!info.is_creator">
						<button class="bottom-btn buy-btn" @tap="buy">
							 立即收下
						</button>
						<view class="tips">转售商品一经售出，不可退换</view>
					</template>
					<template v-else>
						<view class="button-group">
							<button open-type="share" class="bottom-btn bg-green">
								 转发给好友
							</button>
							<button class="bottom-btn cancel-btn" @tap="cancel">
								 取消转售
							</button>
						</view>
					</template>
				</template>
				<template v-else-if="info.union_status === 'closed'">
					<button class="bottom-btn cancel-btn">
						 已取消
					</button>
				</template>
				<template v-else-if="info.union_status === 'completed'">
					<view class="buyer-c">
						已由 <image  class="buyer-headimg" :src="info.buyer.headimg" mode="aspectFit"></image> {{info.buyer.name}} 完成购买
					</view>
				</template>
				
			</view>
		</view>
		

		<!-- <view class="check-more-btn" @tap="toResaleIndex" hover-class="hover">前往挂售区</view> -->
		<!-- </navigator> -->
		
		<view class="detail-image-c" v-if="detailImages">
			<image :src="url" mode="widthFix" class="image" v-for="url in detailImages"></image>
		</view>
		
	</view>
</template>

<script>
    import payment from "@/utils/payment.js"
	export default {
		components: {
		},
		data() {
			return {
				uuid: '',
				info: {
					user: {}
				},
				user: {}
			}
		},
		filters: {
		},
		computed: {
			skus () {
				return  this.info.package_skus || []
			},
			sku () {
				return  this.info.package_skus && this.info.package_skus[0] || {}
			},
			share () {
				return {
					title: this.info.user.name + '向你转售了一个商品，快来看看吧~'
				}
			},
			detailImages () {
				return this.sku.detail_images
			}
		},
		onLoad(e) {
			this.uuid = e.uuid
		},
		onShow() {
			this.initData()
		},
		methods: {
			initData () {
				this.$http(`/asset/resales/${this.uuid}`).then(res => {
					this.info = res.data.info
					this.user = res.data.info.user
				})
			},
			buy () {
				uni.showLoading({
					title: '购买中'
				})
				this.$http(`/asset/resale-order/confirm`, 'POST', {
					'resale_id': this.info.id
				}).then(res => {
					uni.hideLoading()
					
					let info = res.data
					if (!res.data.is_need_pay) {
						uni.showToast({
							title: '购买成功~',
							icon: 'none'
						})
						
						this.initData()
					}
					else {
						payment.pay({
							...info,
							success: () => {
								// uni.showToast({
								// 	title: "支付成功",
								// 	icon: "none"
								// })
								
								this.initData()
								
								uni.showToast({
									title: '购买成功，即将跳转~',
									icon: "none"
								})
								setTimeout(res => {
									uni.redirectTo({
										url: '/pages/myBox/index'
									})
								}, 1500)
							},
							fail: () => {
								uni.showToast({
									title: "支付失败",
									icon: "none"
								})
					
								// 关闭订单
								this.$http(`/orders/${info.order.uuid}`, 'PUT', {
									type: 'close_and_delete'
								})
							}
						})
					}
				})
			},
			cancel () {
				uni.showModal({
					title: "提示",
					content: "确认要取消此转售吗?",
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '取消中'
							})
							this.$http(`/asset/resales/${this.uuid}`, 'PUT', {
								'type': 'close' 
							}).then(res => {
								uni.hideLoading()
								
								uni.showToast({
									title: '取消成功~',
									icon: 'none'
								})
								
								this.initData()
							})
						}
					}
				})
			},
			toResaleIndex () {
				uni.navigateTo({
					url: '/pages/resale/index' 
				})
			}
		},

	}
</script>

<style>
	body {
		background: #f1f1f1;
	}
</style>
<style lang="scss" scoped>
	
.float-btn {
	position: fixed;
	right: 0rpx;
	top: 260rpx;
	width: 130rpx;
	height: 66rpx;
	background: #FFEFB3;
	border-radius: 33px 0px 0px 33px;
	padding: 0rpx 14rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-around;
	
	z-index: 100;

	font-weight: 500;
	font-size: 24rpx;

	image {
		width: 30rpx;
		height: 36rpx;
	}
}
	
button {
	&:after {
		display: none;
	}
	&:before {
		display: none;
	}
}
.container {
	// padding: 30rpx 30rpx;
	// background: #f1f1f1;
}


.card-c {
	background: white;
	padding: 50rpx 30rpx;
	box-sizing: border-box;
	margin: 20rpx auto;
	width:700rpx;
	position: relative;
	border-radius: 16rpx;
	margin: 30rpx 30rpx 30rpx 30rpx;
	
	.status-c {
		position: absolute;
		right: 0rpx;
		top: 90rpx;
		color: white;
		background: #555195;
		font-size: 28rpx;
		font-weight: 500;
		padding: 6rpx 20rpx;
		border-radius: 50rpx 0rpx 0rpx 50rpx;
		
		&.completed {
			background: #2BA246;
		}
		
		&.closed {
			background: #E2374A;
		}
	}
}

.user-c {
	display: flex;
	// justify-content: center;
	align-items: center;
	border-radius: 4rpx;
	.headimg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.middle {
		margin-left: 20rpx;
		.name {
			font-weight: 500;
		}
		.last-time {
			font-size: 24rpx;
			font-weight: 500;
		}
	}
}

.product-c {
	// border: 1px solid red;
	// width: 600rpx;
	margin: 10rpx auto;
	text-align: center;
	.thumb {
		width: 500rpx;
		height: 500rpx;
		border-radius: 10rpx;
		margin: 10rpx 0rpx;
		// border: 1px solid red;
	}
	.title {
		font-weight: 500;
	}
}

.sku-list {
	display: flex;
	flex-wrap: wrap;
	margin: 30rpx 0rpx;
	// max-height: 600rpx;
	.item {
		.thumb {
			width: 180rpx;
			height: 180rpx;
			border-radius: 10rpx;
			margin: 10rpx 10rpx;
			// border: 1px solid red;
		}
		.title {
			width: 180rpx;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}
}

.check-more-btn {
	text-align: center;
	font-size: 28rpx;
	// font-weight: 500;
	// text-decoration: underline;
	width: 200rpx;
	margin: 0rpx auto;
	background: #fefefe;
	padding: 4rpx 4rpx;
	border-radius: 50rpx;
	margin-bottom: 10rpx;
}

.tips {
	margin-top: 10rpx;
	color: gray;
	font-size: 26rpx;
}

.price-c {
	margin-top: 10rpx;
	font-size: 28rpx;
	color: #E02332;
}

.buyer-c {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 50rpx;
}
.buyer-headimg {
	width: 50rpx;
	height: 50rpx;
	border-radius: 6rpx;
	margin-left: 10rpx;
	margin-right: 4rpx;
}

.button-group {
	display: flex;
	.bottom-btn {
		flex: 0 0 40%;
		width: 40%;
	}
}

.bottom-btn {
	color: white;
	width: 600rpx;
	margin: 60rpx auto 0rpx auto;
	// padding: 20rpx 0rpx;
	font-size: 28rpx;
	font-weight: 500;
	border-radius: 50rpx;
	background: #303030;
	line-height: 80rpx;
	
	&.buy-btn {
	}
	
	&.cancel-btn {
		background: #EDEDED;
		color: #999999;
	}
}

.detail-image-c {
	margin-top: 30rpx;
	background: white;
	padding: 20rpx 10rpx 100rpx 10rpx;
	.image {
		width: 100%;
		display: block;
	}
}

</style>
