<template>
	<view class="list-scope">
		<view class="item" :class="grid">
			<CouponItem @tap="clickItem" v-for="(item, index) in list" :coupon="item"></CouponItem>
		</view>
		<!-- <CouponItem @tap="clickItem" class="item" :class="grid" v-for="(item, index) in list" :coupon="item"></CouponItem> -->
		<button class="button button-fresh bg-purple" @tap="initData" v-if="!isInit">
			点击获取优惠券
		</button>
	</view>
</template>

<script>
	import CouponItem from "./components/CouponItem"
	export default {
		props: {
			ids: {
				type: Array
			},
			module: {
				type: Object,
				default () {
					return {}
				}
			},
			refreshCounter: Number
		},
		components: {
			CouponItem
		},
		data() {
			return {
				list: [],
				isInit: false
			}
		},
		mounted() {
			this.initData()
		},
		computed: {
			isScroll() {
				return this.module.display == 'scroll'
			},
			grid() {
				return this.module.grid || 'grid1'
			}
		},
		watch: {
			ids() {
				this.initData()
			},
			refreshCounter() {
				this.initData()
			}
		},
		methods: {
			initData() {
				if (this.ids && this.ids.length > 0) {
					this.$http('/coupons', 'GET', {
						per_page: 100,
						ids: this.ids
					}).then(res => {
						this.list = res.data.list
						this.isInit = true
					})
				}
			},
			clickItem() {
				this.$playAudio('click')
			}
		}
	}
</script>

<style lang="scss">
	.list-scope {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.item {
			flex: 1;
			flex: 0 0 100%;
			width: 100%;
		}

		&.scroll {
			flex-wrap: nowrap;
		}
		
		.grid1 {
			flex: 0 0 100%;
			width: 100%;
		}

		.grid3 {
			width: 32%;
			display: inline-block;
		}
	}
	
	.button-fresh {
		font-size: 24rpx;
		font-weight: 500;
		margin: 40rpx auto;
	}
</style>
