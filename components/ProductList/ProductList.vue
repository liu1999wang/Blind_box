<template>
	<view class="list-scope" :class="{scroll: isScroll}" v-if="wrapMode === 'wrap'">
		<template v-if="grid == 'grid2'">
			<ProductItem @tap="clickItem" :class="grid" :grid="grid" v-for="(item, index) in list" :info="item"></ProductItem>
		</template>
		<template v-else-if="grid == 'grid3'">
			<ProductItem @tap="clickItem" theme="theme-1" :grid="grid" :isShowTags="false" :class="grid" v-for="(item, index) in list" :info="item"></ProductItem>
		</template>
	</view>
	<scroll-view scroll-x class="scroll-list" v-else-if="wrapMode === 'scroll'">
		<template v-if="grid == 'grid2'">
			<ProductItem @tap="clickItem" :class="grid" :grid="grid" v-for="(item, index) in list" :info="item"></ProductItem>
		</template>
		<template v-else-if="grid == 'grid3'">
			<ProductItem @tap="clickItem" theme="theme-1" :grid="grid" :isShowTags="false" :class="grid" v-for="(item, index) in list" :info="item"></ProductItem>
		</template>
	</scroll-view>
</template>

<script>
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
			refreshCounter: Number,
			getNextPageCounter: Number
		},
		data() {
			return {
				page: 1,
				list: []
			}
		},
		mounted() {
			this.initData()
		},
		computed: {
			isScroll() {
				return this.module.theme == 'scroll'
			},
			grid() {
				return this.module.grid || 'grid3'
			},
			wrapMode() {
				return this.module.wrap_mode  || 'wrap'
			}
		},
		watch: {
			ids () {
				this.initData()
			},
			refreshCounter () {
				this.initData()
			},
			getNextPageCounter (val) {
				if (this.module.list_content === 'all') {
					this.getNextPage()
				}
			}
		},
		methods: {
			initData() {
				if (this.module.list_content === 'all') {
					this.page = 1
					
					this.$http('/shop/products', 'GET', {
						page: this.page,
						per_page: 12
					}).then(res => {
						this.list = res.data.list
					})
				}
				else {
					if (this.ids && this.ids.length > 0) {
						this.$http('/shop/products', 'GET', {
							per_page: 80,
							ids: this.ids
						}).then(res => {
							this.list = res.data.list
						})
					}
				}
			},
			clickItem () {
				this.$playAudio('click')
			},
			getNextPage() {
				this.page++
				// console.log('get next page')
				
				this.$http('/shop/products', 'GET', {
					page: this.page,
					per_page: 12
				}).then(res => {
					this.list = this.list.concat(res.data.list)
				})
			}
		}
	}
</script>

<style lang="scss">
	.list-scope {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		&.scroll {
			flex-wrap: nowrap;
		}
		
		.grid2 {
			width: 48%;
			display: inline-block;
		}

		.grid3 {
			width: 32%;
			display: inline-block;
		}
	}
	
	.scroll-list {
		white-space:nowrap;
	
		&.scroll {
			flex-wrap: nowrap;
		}
		
		.grid2 {
			margin-right: 20rpx;
			display: inline-block;
			width: 52%;
		}
	
		.grid3 {
			width: 34%;
			margin-right: 20rpx;
			display: inline-block;
		}
	}
</style>
