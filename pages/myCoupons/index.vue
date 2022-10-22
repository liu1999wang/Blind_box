<template>
	<view class="container">
		<view class="header-tabs">
			<view class="tab-item" :class="{active:current===0}" :data-current="0" @tap="currentChange">
				未使用
			</view>
			<view class="tab-item" :class="{active:current===1}" :data-current="1" @tap="currentChange">
				已使用
			</view>
			<view class="tab-item" :class="{active:current===2}" :data-current="2" @tap="currentChange">
				已过期
			</view>
		</view>
		<view class="swiper-wrapper">
			<swiper :current="current" @change="currentChange2">
				<swiper-item v-for="(item, index) in types" :key="index">
					<scroll-view scroll-y>
						<view class="list">
							<CouponItem :coupon="coupon" v-for="coupon in dataList[index].list" :key="coupon.uuid" :active="item==='valid'?1:0" :unActiveText="unActiveText[item]"></CouponItem>
							<NoData v-if="dataList[index].init&&!dataList[index].list.length"></NoData>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
		<navigator url="/pages/code/index">
			<view class="footer safe-area-bottom">
				<view class="footer-button" hover-class="hover">
					<text>兑换码兑换</text>
				</view>
			</view>
		</navigator>
	</view>
</template>

<script>
	import CouponItem from "./components/CouponItem.vue"
	import NoData from "@/components/NoData/NoData.vue"
	export default {
		components: {
			CouponItem,
			NoData
		},
		data() {
			return {
				codekey: "",
				dataList: [],
				current: 0,
				unActiveText: {
					valid: '立即使用',
					used: '已使用',
					expired: '已过期'
				},
				types: ["valid", "used", "expired"]
			}
		},
		filters: {
			dateFormat(value) {
				return value ? moment(value).format("YYYY/YY/DD") : ''
			},
			dateFormat2(value) {
				return value ? moment(value).format("YY/DD") : ''
			}
		},
		onLoad(e) {
			this.current = e.current ? parseInt(e.current) : 0
			this.types.forEach(item => {
				this.dataList.push({
					list: [],
					type: item,
					page: 1,
					per_page: 15,
					total: 0,
					init: false
				})
			})
			this.getUserCoupons()
		},
		methods: {
			async handleSubmit(e) {
				if(!this.codekey) return
				uni.showLoading()
				const res = await this.$http({
					url: '/pick-coupon',
					method: 'post',
					data: {
						code: this.codekey
					}
				}).catch(err => {
					uni.hideLoading()
				})
				this.getUserCoupons()
				uni.showToast({
					title: '领取成功',
					icon: 'none'
				})
				uni.hideLoading()
				this.codekey = ""
			},
			currentChange(e) {
				let index = e.currentTarget.dataset.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					if (!itemList.init) {
						this.getUserCoupons()
					}
				}
			},
			currentChange2(e) {
				let index = e.detail.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					if (!itemList.init) {
						this.getUserCoupons()
					}
				}
			},
			getUserCoupons() {
				let itemList = this.dataList[this.current]
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$api.emit('user.coupon.list', {
					type: itemList.type,
					page: itemList.page,
					per_page: itemList.per_page
				}).then(res => {
					uni.hideLoading()
					this.dataList[this.current].list.push(...res.data.list)
					this.dataList[this.current].total = res.data.item_total
					this.dataList[this.current].init = true
				})
			}
		}
	}
</script>

<style lang="scss">
	
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
			color: #A5A7B2;
			font-weight: bold;
	
			&.active {
				color: #0E151D;
				position: relative;
	
				&::after {
					content: "";
					position: absolute;
					height: 2px;
					left: 60rpx;
					right: 60rpx;
					bottom: 0;
					background-color: #0E151D;
				}
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
		padding-top: 90upx;
		background-color: #fcfcfc;

		swiper,
		scroll-view {
			width: 100%;
			height: 100%;
			
			.list {
				overflow: hidden;
				// margin: 0rpx 20rpx;
				padding: 0rpx 20rpx;
			}
		}
	}
	
	// .footer {
	// 	position: fixed;
	// 	bottom: 0px;
	// 	width: 100%;
	// 	left: 0px;
	// 	background: white;
	// 	padding: 20rpx 24rpx;
	// 	box-sizing: border-box;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: space-between;
		
	// 	input {
	// 		flex: 1;
	// 		background-color: #fff;
	// 		height: 64rpx;
	// 		padding-left: 20rpx;
	// 		font-size: 26rpx;
	// 	}
		
	// 	.button {
	// 		margin-left: 14rpx;
	// 		width: 160rpx;
	// 		height: 64rpx;
	// 		line-height: 64rpx;
	// 		text-align: center;
	// 		background-color: #ffcc00;
	// 		font-size: 26rpx;
	// 		letter-spacing: 3px;
	// 		border-radius: 10rpx;;
	// 	}
	// }
	
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #f5f5f5;
	
		.footer-button {
			margin: 0 auto;
			margin-bottom: 60rpx;
			width: 680rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			border-radius: 60rpx;
		}
	}
</style>

