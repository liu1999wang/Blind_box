<template>
	<view class="container">
		<view class="list">
			<view class="list-item" v-for="item in list" :key="item.uuid">
				<view class="list-body">
					<view class="action">
						{{item.code.code}}
					</view>
					<view class="date-time">
						{{item.created_at}}
					</view>
				</view>
				<view class="right">
					<text v-if="item.code.code_type == 'coupon'">优惠券 - {{item.code.coupon && item.code.coupon.title}}</text>
					<text v-else-if="item.code.code_type == 'chip'">{{item.code.chip && item.code.chip.title}} {{item.code.prize_total}}块</text>
					<text v-else-if="item.code.code_type == 'score'">{{scoreAlias}} {{item.code.score}}</text>
					<text v-else-if="item.code.code_type == 'redpack'">红包 {{item.code.redpack / 100}}元</text>
					<text v-else-if="item.code.code_type == 'exclude_card'">排除卡 {{item.code.prize_total}}张</text>
					<text v-else-if="item.code.code_type == 'show_card'">透视卡 {{item.code.prize_total}}张</text>
				</view>
			</view>
		</view>
		<NoData v-if="!list.length && init"></NoData>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				per_page: 20,
				init: false,
				loading: false
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			const res = await this.getList()
			uni.hideLoading()
			this.init = true
			this.list.push(...res.data.list)
			this.total = res.data.item_total
			
		},
		async onReachBottom() {
			if(this.loading) return
			this.loading = true
			this.page++
			const res = await this.getList()
			this.loading = false
			this.list.push(...res.data.list)
		},
		methods: {
			async getList() {
				return await this.$http('/code-records', 'GET', {
					page: this.page,
					per_page: this.per_page
				})
			}
		}
	}
</script>

<style lang="scss">
	.content-box {
		margin: 24rpx;
		height: 280upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-radius: 10upx;
		background-color: #ffcc00;
		color: #fff;

		.user-headimg {
			width: 86upx;
			height: 86upx;
			border-radius: 50%;
		}

		.score {
			font-size: 30upx;
			color: #fff;
			margin-top: 16upx;
		}
	}

	.title {
		padding: 0 24rpx;
		margin: 0 24rpx;
		height: 70upx;
		line-height: 70upx;
		font-size: 34upx;
		font-weight: 500;
		position: relative;

		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 18upx;
			width: 3px;
			height: 34upx;
			background-color: #ffcc00;
		}
	}
	
	.list {
		margin: 0 24rpx;
	}
	
	.list-item {
		display: flex;
		padding: 24rpx 0;
		border-bottom: 1px solid #f3f3f3;
	}
	
	.list-body {
		flex: 1;
	}

	.date-time {
		font-size: 24upx;
		margin-top: 10upx;
	}

	.right {
		font-size: 30upx;
		font-weight: 500;
	}
</style>
