<template>
	<view class="container" v-if="info">
		<CouponItem :coupon="info"></CouponItem>
		
		<view class="check-user-group-btn" @tap="isShowUserGroupCheck = true">查看领取条件</view>
		
		<template v-if="!info.is_picked">
			<template v-if="code">
				<button class="pick-btn global-shadow" hover-class="hover" @click="useCode">确认兑换</button>
			</template>
			<template v-else>
				<button class="pick-btn global-shadow" hover-class="hover" @click="pickCoupon" v-if="!info.score_price">领取优惠券</button>
				<button class="pick-btn global-shadow" hover-class="hover" @click="pickCouponWithScore" v-else>使用{{info.score_price}}{{scoreAlias}}兑换</button>
			</template>
		</template>
		<button class="pick-btn global-shadow" hover-class="hover" @click="toUse" v-else>已领券，去使用</button>
		<!-- <IActionSheet :visible="visible" @visibleChange="visibleChange" @change="cancelOrder" :list="reasons" title="选择理由"></IActionSheet> -->
		
		<!-- 人群条件检测 -->
		<UserGroupCheck v-if="isShowUserGroupCheck" @close="isShowUserGroupCheck = false" title="领取此券" :userGroupId="info.user_group_id"></UserGroupCheck>
		
		
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js"
	import CouponItem from "./components/CouponItem.vue"
	import IButton from "@/components/Button/index.vue";
	// import IActionSheet from "@/components/ActionSheet/index.vue";
	// import SplitLine from "@/components/SplitLine/index.vue";

	export default {
		mixins: [mixin],
		components: {
			IButton,
			CouponItem
			// IActionSheet,
			// SplitLine
		},
		data() {
			return {
				uuid: '',
				info: {},
				code: '',
				isShowUserGroupCheck: false,
			}
		},
		filters: {},
		onLoad(e) {
			// this.getOrderInfo(e.uuid)
			this.uuid = e.uuid
			this.code = e.code || ''
			this.initData()
			
			this.$visitor.record('couponn_detail');
		},
		onShow() {
			this.initData()
		},
		methods: {
			useCode() {
				uni.showLoading({
					title: '兑换中'
				})
				this.$http('/code/use', 'POST', {
					code: this.code
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '兑换成功',
						icon: 'none'
					})
					this.initData()
				})
			},
			toUse() {
				if (this.info.to_use_link && this.info.to_use_link.type != 'none' ) {
					this.toLink(this.info.to_use_link)
				}
				else {
					uni.switchTab({
						url: '/pages/shop/index'
					})
				}
			},
			initData() {
				this.$api.emit('core.coupon.show', this.uuid).then(res => {
					this.info = res.data.info
					
					// 不可转发
					if (!this.info.is_shareable) {
						uni.hideShareMenu()
					}
				})
			},
			pickCoupon() {
				uni.showLoading({
					title: '领取中',
					mask: false
				});
				this.$api.emit('core.coupon.pick', this.uuid).then(res => {
					uni.hideLoading()
					this.initData()

					uni.showToast({
						title: '领取成功',
						icon: 'none'
					})
				})
			},
			pickCouponWithScore() {
				uni.showModal({
					title: '兑换提示',
					content: '确认支付' + this.info.score_price + this.scoreAlias + '兑换此优惠券吗?',
					success: res => {
						if (res.confirm) {
							this.pickCoupon()
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #fcfcfc;
		padding: 30upx 20upx;
		width: 100%;
		height: 100%;
		position: fixed;
		box-sizing: border-box;

		.pick-btn {
			&:after {
				display: none;
			}

			margin-top: 100rpx;
			border-radius: 100rpx;
			color: white;
			font-weight: 500;
			background: #FFCC00;
			font-size: 30rpx;
		}
	}
	
	.check-user-group-btn {
		text-decoration: underline;
		text-align: center;
		font-size: 26rpx;
	}
</style>
