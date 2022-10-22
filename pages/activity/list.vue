<template>
	<view class="container">
		<view class="list-scope" :class="{scroll: isScroll}">
			<ActivityItem :theme="grid" :activityType="type" :grid="grid" :class="grid" v-for="(item, index) in list"
				:info="item"></ActivityItem>
		</view>
		<NoData v-if="init&&!list.length"></NoData>
	</view>
</template>

<script>
	// import {
	// 	uniDrawer
	// } from '@dcloudio/uni-ui'
	import mixin from "@/utils/mixin.js"
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				visible: false,
				list: [],
				page: 1,
				per_page: 20,
				total: 0,
				init: false,
				loading: false,
				type: '',
				grid: 'grid2',
				isScroll: false
			}
		},
		computed: {
			title() {
				let map = {
					'yifanshang': '一番赏活动',
					'jika': '集卡活动',
				}

				uni.setNavigationBarTitle({
					title: map[this.type]
				})

				return map[this.type]
			},
			url() {
				let map = {
					'yifanshang': '/yifanshangs',
					'jika': 'jikas'
				}

				return map[this.type]
			}
		},
		watch: {
			key(val) {
				this.page = 1
				this.list = []
				this.initList()
			},
		},
		onLoad(e) {
			this.type = e.type
			this.initList()
		},
		methods: {
			initList() {
				this.loading = true
				uni.showLoading({
					mask: true
				})
				this.$http(`/${this.url}`, 'GET', {
					per_page: this.per_page,
					page: this.page,
				}).then(res => {
					this.init = true
					uni.hideLoading()
					this.list.push(...res.data.list)

					this.loading = false
					this.page++
				})
			},
			showDrawer() {
				this.visible = true
			},
			drawerClose() {
				this.visible = false
			}
		},
		async onReachBottom() {},
	}
</script>

<style lang="scss">
	.container {
		padding: 30rpx 30rpx;
	}
	.list-scope {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	
		&.scroll {
			flex-wrap: nowrap;
		}
	
		.grid1 {
			flex-grow: 1;
		}
	}
</style>
