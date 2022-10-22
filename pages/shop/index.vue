<template>
	<view class="container" style="padding-bottom: 160rpx;">
		
		<PageRender :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :page="page" theme="default"></PageRender>
		
		<!-- <FloatBtn url="/pages/cart/index" :isAnimated="false" src="https://bus-cdn.hquesoft.com/box/shop-float-btn.png"></FloatBtn> -->
		<tab-bar :isselected="1"></tab-bar>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				scrollTop: 0,
				refreshCounter: 0,
				getNextPageCounter: 0
			}
		},
		computed: {
			page() {
				return this.$store.getters.setting.shop_home
			}
		},
		watch: {
		},
		onLoad() {
			this.$visitor.record('box_index');
		},
		onPullDownRefresh() {
			this.$showPullRefresh().then(res => {
				this.refreshCounter ++
			})
		},
		onShow() {},
		methods: {
		},
		onReachBottom () {
			this.getNextPageCounter++
			// console.log('reach bottom')
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>

<style lang="scss" scoped>

</style>
