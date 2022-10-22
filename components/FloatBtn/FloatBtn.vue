<template>
	<image hover-class="hover" mode="widthFix" :style="iStyle" class="float-btn-scorpe-i" :class="{'float-icon-animate': isAnimated && isAnimatedLocal}" @tap="goShareActivity" :src="src"></image>
</template>

<script>
	export default {
		props: {
			height: {
				type: String,
				default: '12'
			},
			isAnimated: {
				type: Boolean,
				default: () => {
					return true
				}
			},
			link: {
				type: Object,
				default: () => {
					return {}
				}
			},
			src: {
				type: String,
				default: () => {
					return ''
				}
			},
			iStyle: {
				type: String,
				default: () => {
					return ''
				}
			}
		},
		data () {
			return {
				isAnimatedLocal: true
			}
		},
		methods: {
			goShareActivity() {
				this.isAnimatedLocal = false
				if(this.link.url=="invite"){
				}else{
					this.toLink(this.link)
				}
				// uni.navigateTo({
				// 	url: this.url
				// })
			}
		}
	}
</script>

<style lang="scss">
	.split-line {
		height: 12px;
		background-color: #f8f8f8;
	}
</style>

<style lang="scss" scoped>
	.float-btn-scorpe-i {
		z-index: 1000;
		width: 160rpx;
		height: 160rpx;
		position: fixed;
		right: 10rpx;
		bottom: 160rpx;
	}
</style>
