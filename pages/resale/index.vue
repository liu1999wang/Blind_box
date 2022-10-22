<template>
	<view class="container">
		
		<view class="header-tabs">
			<view class="tab-item" v-for="(item, index) in typeTextList" :class="{active:current==index}" :data-current="index" @tap="current = index">
				<text class="text">
					{{item}}
				</text>
			</view>
		</view>
		
		<ResaleItem v-for="(item, index) in list" :info="item"></ResaleItem>
		
		<NoData v-if="list.length === 0 && isInit"></NoData>
		<NoMore v-else></NoMore>
		
	</view>
</template>

<script>
	import ResaleItem from "./components/ResaleItem.vue"
	export default {
		components: {
			ResaleItem
		},
		data() {
			return {
				types: ['pending', 'completed'],
				typeTextList: ['进行中'],
				current: 0,
				page: 1,
				perPage: 4,
				list: [],
				isInit: false,
				isLoading: false
			}
		},
		filters: {
		},
		computed: {
		},
		onLoad(e) {
		},
		onShow() {
			uni.showLoading({
				title: '加载中~'
			})
			
			this.initData().then(res => {
				uni.hideLoading()
			})
		},
		watch: {
			current (val) {
				this.page = 1
				this.list = []
				this.initData()
			}
		},
		onReachBottom () {
			this.initData()
		},
		methods: {
			initData () {
				if (this.isLoading) 
					return false 
					
				this.isLoading = true
				
				return this.$http(`/asset/resales`, 'GET', {
					status: this.types[this.current],
					page: this.page,
					per_page: this.perPage
				}).then(res => {
					this.list = this.list.concat(res.data.list)
					
					this.isInit = true
					this.isLoading = false
					this.page++
					// this.user = res.data.info.user
				})
			}
		},

	}
</script>

<style>
	body {
		background: #f1f1f1;
	}
</style>
<style lang="scss" scoped>
.container {
	padding: 100rpx 20rpx 30rpx 20rpx;
	// background: #f1f1f1;
}

.header-tabs {
	width: 100%;
	height: 90rpx;
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	background-color: #ffffff;

	.tab-item {
		flex: 1;
		line-height: 90rpx;
		text-align: center;
		font-size: 28rpx;
		color: rgba(198, 198, 198, 1);
		font-weight: 500;

		&.active {
			color: rgba(51, 51, 51, 1);
			position: relative;
			font-weight: 700;
			font-size: 30rpx;

			.text {
				border-bottom: 6rpx solid #FFC600;
				padding: 0rpx 0rpx 4rpx 0rpx;
			}
		}
	}
}

.card-c {
	background: white;
	padding: 50rpx 30rpx;
	box-sizing: border-box;
	margin: 30rpx auto;
	width: 690rpx;
	position: relative;
	
	.status-c {
		position: absolute;
		right: 0rpx;
		top: 90rpx;
		color: white;
		background: #555195;
		font-size: 28rpx;
		font-weight: 500;
		padding: 6rpx 20rpx;
		border-radius: 50rpx 0rpx 0rpx 50rpx;
		
		&.completed {
			background: #2BA246;
		}
		
		&.closed {
			background: #E2374A;
		}
	}
}

.user-c {
	display: flex;
	// justify-content: center;
	align-items: center;
	border-radius: 4rpx;
	.headimg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.middle {
		margin-left: 20rpx;
		.name {
			font-weight: 500;
		}
		.last-time {
			font-size: 24rpx;
			font-weight: 500;
		}
	}
}

.product-c {
	// border: 1px solid red;
	// width: 600rpx;
	margin: 10rpx auto;
	text-align: center;
	.thumb {
		width: 500rpx;
		height: 500rpx;
		border-radius: 10rpx;
		margin: 10rpx 0rpx;
		// border: 1px solid red;
	}
	.title {
		font-weight: 500;
	}
}

.check-more-btn {
	text-align: center;
	font-size: 28rpx;
	// font-weight: 500;
	// text-decoration: underline;
	width: 200rpx;
	margin: 0rpx auto;
	background: #fefefe;
	padding: 4rpx 4rpx;
	border-radius: 50rpx;
}

.tips {
	margin-top: 10rpx;
	color: gray;
	font-size: 26rpx;
}

.price-c {
	margin-top: 10rpx;
	font-size: 28rpx;
	color: #E02332;
}

.buyer-c {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 50rpx;
}
.buyer-headimg {
	width: 50rpx;
	height: 50rpx;
	border-radius: 6rpx;
	margin-left: 10rpx;
	margin-right: 4rpx;
}

.bottom-btn {
	color: white;
	width: 600rpx;
	margin: 60rpx auto 0rpx auto;
	// padding: 20rpx 0rpx;
	font-size: 28rpx;
	font-weight: 500;
	border-radius: 50rpx;
	background: #303030;
	line-height: 100rpx;
	
	&.buy-btn {
	}
	
	&.cancel-btn {
		background: #EDEDED;
		color: #999999;
	}
}

</style>
