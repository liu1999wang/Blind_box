<template>
	<view class="container">
		<navigator url="/pages/code/record">
			<view class="record-btn">兑换记录</view>
		</navigator>

		<view class="content">
			<view class="title">输入兑换码查看可兑换的物品</view>
			<input class="code-input" v-model="code" placeholder="点击输入兑换码"></input>
			<button class="submit-button" @tap="submit">兑换</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				code: '',
				info: {}
			}
		},
		computed: {},
		onLoad(e) {
			this.code = e.code || ''
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
						title: '兑换成功，跳转中~',
						icon: 'none'
					})
					setTimeout(res => {
						if (this.info.code_type == 'score') {
							uni.navigateTo({
								url: '/pages/myScore/index'
							})
						}
						else if (this.info.code_type == 'redpack') {
							uni.navigateTo({
								url: '/pages/myRedpack/index'
							})
						}
						else if (this.info.code_type == 'show_card' || this.info.code_type == 'exclude_card') {
							uni.navigateTo({
								url: '/pages/myCard/index'
							})
						}
						else if (this.info.code_type == 'chip') {
							uni.navigateTo({
								url: '/pages/myChip/index'
							})
						}
						else if (this.info.code_type == 'product') {
							uni.navigateTo({
								url: '/pages/myBox/index'
							})
						}
					}, 1500)
				})
			},
			submit () {
				if (this.code.length < 4 || this.code.length > 10) {
					uni.showToast({
						title: '兑换码长度应在4到10个字符之间~',
						icon: 'none'
					})
					return false
				}
				
				uni.showLoading({
					title: '校验中'
				})
				
				this.$http('/code/check', 'POST', {
					code: this.code
				}).then(res => {
					uni.hideLoading()
					
					let info = res.data
					this.info = info
					if (info.code_type == 'coupon') {
						uni.navigateTo({
							url: '/pages/couponDetail/index?uuid=' + info.coupon.uuid + '&code=' + this.code
						})
					}
					else {
						
						let content = ''
						
						if (info.code_type === 'score') {
							content = `此兑换码可兑换${info.score}${this.scoreAlias}`
						}
						else if (info.code_type === 'redpack') {
							content = `此兑换码可兑换${info.redpack/100}元余额`
						}
						else if (info.code_type === 'exclude_card') {
							content = `此兑换码可兑换${info.prize_total}张排除卡`
						}
						else if (info.code_type === 'show_card') {
							content = `此兑换码可兑换${info.prize_total}张透视卡`
						}
						else if (info.code_type === 'chip') {
							content = `此兑换码可兑换${info.prize_total}块"` + info.chip.title + '"'
						}
						else if (info.code_type === 'product') {
							content = `兑换 "${info.product.title}" 1件`
						}
						
						uni.showModal({
							title: '兑换提示',
							content: content,
							confirmText: '立即兑换',
							success: res => {
								if (res.confirm) {
									this.useCode()
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FCFCFC;
	}
</style>

<style lang="scss" scoped>
	.record-btn {
		position: fixed;
		right: 20rpx;
		top: 50rpx;
		text-decoration: underline;
	}
	.content {
		height: 100vh;
		display: flex;
		/* #ifdef MP-KUAISHOU */
			padding-top: 300rpx;
		/* #endif */
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding-bottom: 300rpx;
		box-sizing: border-box;
	}
	.title {
		
	}
	.code-input {
		border: 1px solid #878787;
		text-align: center;
		padding: 20rpx 0rpx;
		width: 680rpx;
		margin: 0rpx auto;
		background: #F8F8F8;
		margin-top: 30rpx;
		letter-spacing: 10rpx;
	}
	.submit-button {
		background: #F27233;
		color: white;
		width: 680rpx;
		margin-top: 60rpx;
		border-radius: 0rpx;
		&:after {
			display: none;
		}
	}
</style>
