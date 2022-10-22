<template>
	<view class="container">
		<!-- <TextNavBar :title="title"></TextNavBar> -->
		<PageRender :page="page" v-if="isInit" theme="default"></PageRender>
	</view>
</template>

<script>
	export default {
		name: "rule",
		data() {
			return {
				isInit: false,
				type: '',
				page: {
					
				}
			}
		},
		computed: {
		},
		watch: {
		},
		onLoad(e) {
			this.type = e.type
			this.initData()
		},
		methods: {
			initData () {
				this.$http('/setting/contact_page').then(res => {
					this.page = res.data.setting
					this.isInit = true
				})
			}
		}
	}
</script>

<style lang="scss">
.rule-image {
	width: 100%;
	display: block;
}
</style>
