<template>
	<view class="container">
		<PageRender :page="page" :refreshCounter="refreshCounter" theme="default"></PageRender>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				uuid: '',
				info: {
				},
				refreshCounter: 1
			}
		},
		computed: {
			page () {
				return this.info.content || {}
			}
		},
		watch: {},
		onLoad(e) {
			this.uuid = e.uuid
			this.initData()
		},
		onShow() {
			this.refreshCounter ++
		},
		methods: {
			initData() {
				uni.showLoading({
					title: '加载中'
				})
				this.$http(`/pages/${this.uuid}`).then(res => {
					this.info = res.data.info
					
					uni.hideLoading()
				})
			},
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.container {
		
	}
</style>
