<template>
	<view class="scope-address padding space-between" @tap="handleSelectAddress">
		<text class="new-iconfont icon-address"></text>
		<view class="address-body" v-if="address && address.id">
			<view class="region">
				<text class="tag bg-red" v-if="address.is_default">默认</text>
				<text class="tag bg-blue" v-if="address.tag">{{address.tag}}</text>
				<text>{{address.province+address.city+address.district}}</text>
			</view>
			<view class="detail">
				{{address.address}}
			</view>
			<view class="name-phone" v-if="isShowPhone">
				<text>{{address.consignee}}</text>
				<text>{{address&&address.phone | hidePhoneDetail}}</text>
			</view>
		</view>
		<view class="address-body" v-else>
			<view class="no-address" style="font-size: 38rpx;font-weight: bold;letter-spacing: 1px;">
				未添加收货地址
			</view>
		</view>
		<view class="new-iconfont icon-arrow-right"></view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Object
			},
			isShowPhone: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		data() {
			return {
				address: {}
			}
		},
		filters: {
			hidePhoneDetail(value) {
				return value ? value.substring(0, 3) + '****' + value.substring(7, 11) : ''
			}
		},
		watch: {
			address () {
				this.$emit('input', this.address)
			},
			value (val) {
				this.address = val
			}
		},
		mounted(e) {
			this.address = this.value || {}
			uni.$on('selectAddress', res => {
				this.address = res
			})
		},
		beforeDestroy() {
			uni.$off('selectAddress', data => {
				console.log('移除 selectAddress 自定义事件');
			})
		},
		methods: {
			handleSelectAddress() {
				uni.navigateTo({
					url: "/pages/myAddress/index?select=true"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scope-address {
		position: relative;
		align-items: center;
		min-height: 104rpx;
		display: flex;
		align-items: center;
		border: 1px solid #f5f5f5;

		.icon-address {
			font-size: 40rpx;
		}

		.icon-arrow-right {
			font-size: 46rpx;
		}

		.address-body {
			flex-grow: 1;
			margin-left: 20rpx;
		}

		.region {
			display: flex;
			align-items: center;

			font-size: 26upx;

			.tag {
				padding: 4upx 14upx;
				font-size: 22upx;
				border-radius: 3px;
				margin-right: 12upx;
			}
		}

		.detail {
			font-size: 38upx;
			margin: 10upx 0;
		}

		.name-phone {
			display: flex;
			font-size: 26upx;

			text {
				margin-right: 24upx;
			}
		}
	}
</style>
