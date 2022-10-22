<template>
	<view class="list-scope" :class="'list-' + grid" v-if="wrapMode === 'wrap'">
		<view class="row1-item" v-if="grid == 'row1'">
			<template v-if="activityType === 'seckill'">
				<Row1Seckill @click="clickItem(item)" :info="item" v-for="(item, index) in list" />
			</template>
			<Row1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" v-else />
		</view>
		<template v-if="grid == 'grid1'">
			<Grid1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid2'">
			<Grid2  @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid3'">
			<Grid3 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
	</view>
	<scroll-view scroll-x class="scroll-list" :class="grid" v-else-if="wrapMode === 'scroll'">
		<template v-if="grid == 'row1'">
			<Row1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-if="grid == 'grid1'">
			<Grid1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid2'">
			<Grid2  @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
		<template v-else-if="grid == 'grid3'">
			<Grid3 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item"/>
		</template>
	</scroll-view>
</template>

<script>
	import Row1 from "@/components/ActivityItem/Row1.vue"
	import Grid1 from "@/components/ActivityItem/Grid1.vue"
	import Grid2 from "@/components/ActivityItem/Grid2.vue"
	import Grid3 from "@/components/ActivityItem/Grid3.vue"
	import Row1Seckill from "@/components/ActivityItem/Row1Seckill.vue"
	
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
			Grid3,
			Row1Seckill
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
			},
			url () {
				// console.log('type ====', this.module.activity_type)
			  let map  = {
			    yifanshang: '/yifanshangs',
				lottery: '/lotteries',
				seckill: '/seckills',
				egg_lottery: '/egg-lotteries',
				jika: '/jikas',
				fudai: '/fudais',
				rotate_lottery: '/rotate-lotteries',
				box: '/boxes',
				zhuli: '/zhuli/activities'
			  }
			  return map[this.module.activity_type]
			},
			activityType () {
				return this.module.activity_type || ''
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
					
					this.$http(this.url, 'GET', {
						page: this.page,
						per_page: 12
					}).then(res => {
						this.list = res.data.list
					})
				}
				else  {
					if (this.ids && this.ids.length > 0) {
						this.$http(this.url, 'GET', {
							per_page: 100,
							ids: this.ids
						}).then(res => {
							this.list = res.data.list
						})
					}
				}
			},
			clickItem (item) {
				// this.$playAudio('click')
				
				let url = ''
				if (item.activity_type === 'yifanshang') {
					url = `/pages/yifanshang/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'lottery') {
					url = `/pages/lottery/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'egg_lottery') {
					url = `/pages/eggLottery/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'seckill') {
					url = `/pages/seckill/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'jika') {
					url = `/pages/jika/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'fudai') {
					url = `/pages/fudai/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'rotate_lottery') {
					url = `/pages/rotateLottery/detail?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'box') {
					url = `/pages/boxDetail/index?uuid=${item.uuid}`
				}
				else if (item.activity_type === 'zhuli') {
					url = `/pages/zhuli/detail?uuid=${item.uuid}`
				}
				
				uni.navigateTo({
					url: url
				})
				
			},
			getNextPage() {
				this.page++
				// console.log('get next page')
				
				this.$http(this.url, 'GET', {
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
		
		.row1-item {
			width: 100%;
		}
		
		.row1 {
			width: 100%;
		}
		
		.grid1 {
			flex: 0 0 100%;
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
