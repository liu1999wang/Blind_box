<template>
	<view class="list-scope" :class="'list-' + grid" v-if="wrapMode === 'wrap'">
		<template v-if="grid == 'row1'">
			<Row1 theme="theme-1" @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-if="grid == 'grid1'">
			<Grid1 theme="theme-1" @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid2'">
			<Grid2  @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid3'">
			<Grid3 theme="theme-1" @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
	</view>
	<scroll-view scroll-x class="scroll-list" :class="grid" v-else-if="wrapMode === 'scroll'">
		<template v-if="grid == 'row1'">
			<Row1 theme="theme-1" @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-if="grid == 'grid1'">
			<Grid1 theme="theme-1" @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid2'">
			<Grid2  @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid3'">
			<Grid3 theme="theme-1" @tap="clickItem" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
	</scroll-view>
</template>

<script>
	import Row1 from "@/components/BoxItem/Row1.vue"
	import Grid1 from "@/components/BoxItem/Grid1.vue"
	import Grid2 from "@/components/BoxItem/Grid2.vue"
	import Grid3 from "@/components/BoxItem/Grid3.vue"
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
		components: {
			Row1,
			Grid1,
			Grid2,
			Grid3
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
				return this.module.display == 'scroll'
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
					
					this.$http('/boxes', 'GET', {
						page: this.page,
						per_page: 12
					}).then(res => {
						this.list = res.data.list
					})
				}
				else  {
					if (this.ids && this.ids.length > 0) {
						this.$http('/boxes', 'GET', {
							per_page: 100,
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
				
				this.$http('/boxes', 'GET', {
					page: this.page,
					per_page: 12
				}).then(res => {
					this.list = this.list.concat(res.data.list)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-scope {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		position: relative;
		
		&.list-grid3 {
			// justify-content: flex-start;
			// justify-content: space-around;
		}
		
		.row1 {
			width: 100%;
		}
		
		.grid1 {
			width: 100%;
		}
		
		.grid2 {
			width: 48%;
		}

		.grid3 {
			width: 31%;
			// flex: 0 0 31%;
			
			// overflow: hidden;
			// border: 5px solid red;
			// margin-right: 20rpx;
			// display: inline-block;
			// &:nth-child(3n) {
			// 	margin-right: 0rpx;
			// }
		}
	}
	
	.scroll-list {
		
		white-space:nowrap;
		
		// border: 1px solid red;
		
		.grid1 {
			margin-right: 20rpx;
			display: inline-block;
			width: 80%;
		}
		
		.grid2 {
			margin-right: 30rpx;
			display: inline-block;
			width: 52%;
		}
		
		.row1 {
			margin-right: 30rpx;
			display: inline-block;
			width: 90%;
		}
	
		.grid3 {
			width: 34%;
			margin-right: 20rpx;
			display: inline-block;
		}
	}
</style>
