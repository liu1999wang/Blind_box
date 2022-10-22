<template>
	<view class="mask" @tap="cancel">
		<view class="mask-content " @tap.stop>
			<!-- <text class="new-iconfont icon-close close-btn" @tap="cancel"></text> -->
<!-- 			<view class="title">
				开赏记录
				<template v-if="tag === 'all'">
					({{total || 0}})
				</template>
			</view> -->
			
			<view class="tag-list">
				<view class="item" :class="{actived: tag === 'all'}" @tap="setTag('all')">全部</view>
				<view class="item" :class="{actived: tag === 'free_order'}" @tap="setTag('free_order')">免单</view>
				<view class="item" :class="{actived: tag === item.id}" @tap="setTag(item.id)" v-for="(item, index) in tagList">
					{{item.title}}
				</view>
			</view>

			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<template v-for="(item, index) in list">
						<view hover-class="hover" class="item-scope global-shadow-2">

							<view class="user-c">
								<image :src="item.user && item.user.headimg" mode="aspectFill" class="headimg"></image>
								<view class="name">{{item.user && item.user.name}}</view>
								<!-- <view class="open-index" v-if="item.open_index">第{{item.open_index}}发</view> -->
								<view class="time">{{$tool.formatDate(item.created_at, 'MM/dd hh:mm:ss')}}</view>
							</view>
							
							<view class="sku-c">
								<image :src="item.sku.thumb" mode="aspectFit" class="thumb"></image>
								<view class="sku-title">{{item.sku.title}}</view>
								<view style="flex-grow: 1"></view>
								<view class="shang-title strong" style="margin-right: 10rpx;" v-if="item.free_order_total">
									<template v-if="item.free_order_total != 1">{{item.free_order_total}}</template>免单
								</view>
								<view class="shang-title" :class="{strong: item.shang_type == 1}">{{item.shang_title}}</view>
								<view class="total">x{{item.total}}</view>
							</view>
							
						</view>
					</template>
					<!-- <NoData v-if="!list.length && isInit"></NoData> -->
				</view>
				<view style="height: 300rpx;"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				isInit: false,
				list: [],
				total: 0,
				page: 1,
				perPage: 20,
				tag: 'all'
			}
		},
		props: {
			info: {
				type: Object
			},
			room: {
				type: Object
			}
		},
		computed: {
			tagList () {
				return this.info.skus.filter(item => {
					return item.shang_type === 0
				}).map(item => {
					return {
						title: item.shang_title,
						id: item.id
					}
				})
			}
		},
		watch: {
			payTotal() {
				this.initOrder()
			},
			tag () {
				this.page = 1
				this.list = []
				this.fetchList()
			}
		},
		created() {
			this.initData()
		},
		methods: {
			setTag (tag) {
				this.tag = tag 
			},
			initData() {
				uni.showLoading({
					title: '加载中'
				})

				this.fetchList().then(res => {
					uni.hideLoading()
				})
				
				return this.$http(`/yifanshang/${this.info.uuid}/record-total`, 'GET', {
					room_id: this.room.id
				}).then(res => {
					this.total = res.data.all
				})
			},
			fetchList() {
				if (this.isLoading)
					return false

				this.isLoading = true

				return this.$http(`/yifanshang/${this.info.uuid}/records`, 'GET', {
					room_id: this.room.id,
					page: this.page,
					per_page: this.perPage,
					tag: this.tag
				}).then(res => {
					this.isInit = true
					
					// 转换list 
					// 此处默认为需要拆分显示
					let isNeedSplitDisplay = true
					
					if (isNeedSplitDisplay) {
						// 需要拆分显示
						let freeOrderTotal = 0
						let list = []
						res.data.list.map(item => {
							list = [];
							freeOrderTotal = item.free_order_total
							for (let i=0; i<item.total; i++) {
								if (freeOrderTotal > 0) {
									// 还有免单
									list.push({
										...item,
										total: 1,
										free_order_total: 1
									})
								}
								else {
									if (this.tag != 'free_order') {
										list.push({
											...item,
											total: 1,
											free_order_total: 0
										})
									}
								}
								freeOrderTotal--
							}
							
							// 打乱list顺序
							list.sort(function(){
							    return Math.random()-0.5
							})
							
							this.list = this.list.concat(list)
						})
					}
					else {
						// 不需要拆分
						this.list = this.list.concat(res.data.list)
					}
					
					this.isLoading = false
					this.page++
					// this.total = res.data.item_total
				}).catch(err => {
					this.isInit = false
				})
			},
			cancel() {
				this.$emit('close')
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.mask {
		position: relative;
		display: block;
		z-index: 111;
	}
	.small-text {
		// font-size: 80%;
	}

	.mask-content {
		position: relative;
		display: block;
		width: 100%;
		height: 700rpx;
		background-color: #000000;
		color: #FFFFFF;
		// background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		

		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
		}
	}

	.scroll-view {
		height: 500rpx;
		overflow: auto;
		padding-bottom: 200rpx;
	}
	
	.tag-list {
		display: flex;
		// flex-wrap: wrap;
		margin-top: 20rpx;
		padding-bottom: 20rpx;
		overflow-x: auto;
		.item {
			display: block;
			width: 150rpx;
			font-weight: 500;
			white-space:nowrap;
			// border-radius: 40rpx;
			border: 2rpx solid #fcd066;
			// background: #e1e1e1;
			padding: 6rpx 26rpx;
			margin-left: 20rpx;
			font-size: 28rpx;

			
			&.actived {
				background: #fcd066;
				border: 2rpx solid #fcd066;
				color: #000000;
			}
		}
	}
	// 隐藏滚动条
	.tag-list::-webkit-scrollbar{
		display: none;
	}

	.list-scope {
		padding: 30rpx 0rpx;

		.item-scope {
			// display: flex;
			// padding: 10rpx 0rpx;
			// border-bottom: 1rpx solid #F1F1F1;
			position: relative;
			
			background: #1b1918;

			border: 2px solid #1b1918;
			margin-bottom: 30rpx;

			// display: flex;
			// align-items: center;
			padding: 30rpx 20rpx;

			.user-c {
				display: flex;
				align-items: center;
				.headimg {
					width: 40rpx;
					height: 40rpx;
					flex: 0 0 40rpx;
					border-radius: 50%;
				}

				.name {
					font-weight: 500;
					font-size: 28rpx;
					flex-grow: 1;
					margin-left: 10rpx;
				}
				.open-index {
					margin-right: 10rpx;
					font-weight: 400;
				}
				.time {
					font-weight: 500;
					font-size: 28rpx;
				}
			}
			
			.sku-c {
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				
				.thumb {
					width: 40rpx;
					height: 40rpx;
					border: 1rpx solid #e1e1e1;
					max-width: 400rpx;
				}
				
				.shang-title {
					font-size: 28rpx;
					font-weight: 500;
					color: #fcd066;
					&.strong {
						// background:  #FCF6D8;
						color: #f50a0e;
						padding: 4rpx 10rpx;
						font-size: 30rpx;
						font-weight: 900;
						border-radius: 6rpx;
						margin-left: 10rpx;
						
					}
				}
				
				.total {
					margin-left: 20rpx;
				}
				
				.sku-title {
					font-size: 28rpx;
					font-weight: 500;
					// flex-grow: 1;
					text-align: left;
					margin-left: 10rpx;
					max-width: 410rpx;
					
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
</style>
