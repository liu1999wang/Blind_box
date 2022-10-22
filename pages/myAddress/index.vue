<template>
	<view class="container">
		<view class="address">
			<view class="address-item" v-for="(item, index) in list" :key="index" :data-index="index" @tap="selectAddress">
				<view class="user-info">
					<text class="user-name">{{item.consignee}}</text>
					<text class="user-phone">{{item.phone | hidePhoneDetail}}</text>
				</view>
				<view class="address-info">
					{{item.province + item.city + item.district + item.address}}
				</view>
				<view class="actions" @tap.stop>
					<view class="iconfont icon-empty" :data-index="index" @tap="handleDelete"></view>
					<view class="iconfont icon-editor" :data-index="index" @tap="handleEdit"></view>
				</view>
			</view>
			<NoData v-if="!list.length&&init" title="暂无地址"></NoData>
		</view>
		<view class="footer safe-area-bottom">
			<view class="footer-button add" @click="handleNewAddress" hover-class="hover">
				<text>新建地址</text>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="footer-button import" @click="handleImportAddress" hover-class="hover">
				<text>从微信导入</text>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef MP-ALIPAY -->
			<!-- <view class="footer-button import" @click="handleImportAddress" hover-class="hover">
				<text>从天猫导入</text>
			</view> -->
			<!-- #endif -->
			
		</view>
	</view>
</template>

<script>
	import {
		getAddressList,
		deleteAddress,
		createAddress
	} from "../../api/address.js"
	import NoData from "../../components/NoData/NoData.vue";
	export default {
		components: {
			NoData
		},
		data() {
			return {
				list: [],
				select: false,
				init: false
			}
		},
		filters: {
			hidePhoneDetail(value) {
				return value.substring(0, 3) + '****' + value.substring(7, 11)
			}
		},
		onLoad(e) {
			if (e.select) {
				this.select = true
			}
		},
		onShow() {
			uni.showLoading({
				title: '加载中'
			})
			getAddressList().then(res => {
				this.list = res.data.addresses
				this.init = true
				uni.hideLoading()
			})
		},
		methods: {
			fetchData() {
				getAddressList().then(res => {
					this.list = res.data.addresses
					this.init = true
					uni.hideLoading()
				})
			},
			selectAddress(e) {
				if (this.select) {
					uni.$emit("selectAddress", this.list[e.currentTarget.dataset.index])
					uni.navigateBack({
						delta: 1
					})
				}
			},
			handleEdit(e) {
				let index = e.currentTarget.dataset.index
				let item = this.list[index]
				this.$navigator.navigateTo({
					url: `/pages/setAddress/index?uuid=${item.uuid}` + 
								`&consignee=${item.consignee}` + 
								`&phone=${item.phone}` + 
								`&province=${item.province}` + 
								`&city=${item.city}` + 
								`&district=${item.district}` + 
								`&address=${item.address}` + 
								`&tag=${item.tag}` + 
								`&is_default=${item.is_default}`
				})
			},
			handleDelete(e) {
				let index = e.currentTarget.dataset.index
				uni.showModal({
					title: '提示',
					content: '删除该收货地址?',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							})
							deleteAddress(this.list[index].uuid).then(res => {
								this.list.splice(index, 1)
								uni.hideLoading()
							})
						}
					}
				})
			},
			handleNewAddress() {
				uni.navigateTo({
					url: "/pages/setAddress/index"
				})
			},
			$getAddress (options) {
				console.log('main get address =======>')
				my.authorize({
					scopes: 'scope.addressList',
					success: (res) => {
						my.tb.chooseAddress({
								addAddress: "show",
								searchAddress: "hide",
								locateAddress: "hide"
							},
							(res) => {
								options.success && options.success(res)
							},
							(res) => {
								options.fail && options.fail(res)
							})
					}
				})
			},
			handleImportAddress() {
				uni.chooseAddress({
					success: (address) => {
								
						if (address.error) {
							return false
						}
								
						createAddress({
							consignee: address.userName,
							phone: address.telNumber,
							province: address.provinceName,
							city: address.cityName,
							district: address.countyName,
							address: address.detailInfo,
							tag: '',
							is_default: 0
						}).then(res => {
							this.fetchData()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
	view {
		box-sizing: border-box;
	}
	.address-item {
		padding: 30rpx 20rpx;
		margin: 30upx 24upx;
		position: relative;
		box-shadow: 0 0 20rpx rgba(209, 209, 209, 0.5);
		background-color: #fff;
		border-radius: 10rpx;

		.user-info {
			display: flex;
			align-items: center;
			font-size: 32upx;

			.user-phone {
				margin-left: 80upx;
			}
		}

		.address-info {
			font-size: 26upx;
			margin-top: 28upx;
		}

		.actions {
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			box-sizing: border-box;
			padding: 20upx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-direction: column;

			&>view {
				padding: 0 16upx;
				font-size: 42upx;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #f5f5f5;
	
		display: flex;
	
		.footer-button {
			margin: 0 auto;
			margin-bottom: 60rpx;
			width: 300rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			border-radius: 600rpx;
	
			&.add {
				background-color: #ffcc00;
				box-shadow: 0 0 20rpx rgba(66, 66, 66, 0.2);
			}
		}
	
	}
</style>
