<template>
	<view class="container">
		<!-- <HomeNavbar :title="page.title" searchType="box" :theme="scrollTop > 200 ? 'white' : ''"></HomeNavbar> -->
		
		<!-- <Banner :list="banner" style="height: 640rpx;" class="banner-c"></Banner> -->
		
		<PageRender :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter"  :page="page" theme="default"></PageRender>
		
		<!-- <FloatBtn url="/pages/myActivity/index" :isAnimated="false" src="https://bus-cdn.hquesoft.com/box/activity-float-btn.png"></FloatBtn> -->
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
				return this.$store.getters.setting.activity_home
			}
		},
		watch: {
		},
		onLoad() {
			this.$visitor.record('activity_index');
		},
		onPullDownRefresh() {
			this.$showPullRefresh().then(res => {
				this.refreshCounter++
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
