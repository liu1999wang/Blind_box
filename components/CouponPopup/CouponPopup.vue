<template>
	<view class="mask" @touchmove.stop>
		<view class="mask-content animated bounceInDown"
			:style="'background-image: url(' + bg + '); background-size: 100% auto; background-repeat: no-repeat;'"
			@tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<!-- <view class="title">转售给朋友</view> -->
			
			<scroll-view class="coupon-list" scroll-y>
				<CouponItem v-for="(item, index) in list" :coupon="item"></CouponItem>
			</scroll-view>
			
			<image @tap="pickAllCoupon" mode="widthFix" src="https://cdn2.hquesoft.com/box/couponPopup/btn.png" class="confirm-btn"></image>
			<!-- <view class="btn-c">
				<image src="https://cdn2.hquesoft.com/box/couponPopup/btn.png" class="btn"></image>
			</view> -->
		</view>
	</view>
</template>

<script>
	import CouponItem from "./CouponItem.vue"
	export default {
		components: {
			CouponItem
		},
		data() {
			return {
				info: {},
				list: []
			}
		},
		props: {
		},
		computed: {
			link () {
				return this.$store.getters.setting.coupon_popup.link
			},
			bg () {
				return this.$store.getters.setting.coupon_popup.bg || 'https://cdn2.hquesoft.com/box/couponPopup/bg.png'
			}
		},
		watch: {
		},
		onLoad(e) {
			
		},
		created() {
			this.$http('/coupon/popup-list').then(res => {
				this.list = res.data.list
			})
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			pickAllCoupon() {
				uni.showLoading({
					title: '领取中~',
					icon: 'none'
				})
				this.$http('/coupon/pick-popup', 'POST').then(res => {
					let title = '领取成功~'
					
					uni.showToast({
						title: title,
						icon: 'none'
					})
					uni.setStorageSync('coupon_popup', 1)
					uni.hideLoading()
					this.$emit('pickSuccess')
					
					setTimeout(() => {
						this.toLink(this.link)
					}, 1300)
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.small-text {
		// font-size: 80%;
	}

	.mask {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.mask-content {
		// width: 660rpx;
		
		width: 630rpx;
		// height: 900rpx;
		// background: linear-gradient(180deg, #FFC472, #EC6A2C);
		// background-image: url('https://cdn2.hquesoft.com/box/couponPopup/bg.png');
		// background-size: 100% auto;
		// background-repeat: no-repeat;
		// height: 680rpx;
		// background-color: #EDEDED;
		// background-color: white;
		border-radius: 20rpx;
		// border: 1px solid red;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 60rpx 60rpx 50rpx 60rpx;
		box-sizing: border-box;
		position: relative;
		background-position: 12rpx 0rpx;
		
		.coupon-list {
			max-height: 540rpx;
			margin-top: 230rpx;
			margin-bottom: 60rpx;
			// border: 1px solid red;
			padding: 0rpx 10rpx;
			box-sizing: border-box;
		}

		.close-btn {
			position: absolute;
			right: 26rpx;
			top: 26rpx;

			color: #fff;
		}

		.confirm-btn {
			position: absolute;
			bottom: -50rpx;
			left: 110rpx;
			width: 400rpx;
			margin: 0rpx auto;
		}
	}
</style>
