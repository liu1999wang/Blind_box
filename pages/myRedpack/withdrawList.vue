<template>
	<view class="container">
		<view class="list">
			<view class="list-item" v-for="item in list" :key="item.uuid">
				<view class="list-body">
					<view class="action">
						{{typeMap[item.withdraw_type]}}
					</view>
					<view class="number">
						{{item.number}}
					</view>
					<view class="date-time">
						{{item.created_at}}
					</view>
				</view>
				<view class="right">
					<view class="value">{{$tool.formatPrice(item.value)}}</view>
					<view class="status" :class="item.union_status">{{item.union_status_text}}</view>
				</view>
			</view>
		</view>
		<!-- <NoData></NoData> -->
		<NoData v-if="!list.length && init"></NoData>
		
	</view>
</template>

<script>
	export default { 
		components: {},
		data() {
			return {
				list: [],
				loading: false,
				per_page: 20,
				page: 1,
				init: false,
				typeMap: {
					'alipay': '支付宝',
					'wechat_pay': '微信转帐',
					'wechat_pay_auto': '微信零钱',
					'bank': '银行卡'
				},
				setting: {}
			}
		},
		computed: {
		},
		watch: {
		},
		async onLoad() {
		},
		onShow () {
			this.getList()
		},
		filters: {
		},
		methods: {
			getList() {
				if (this.loading) return
				this.loading = true
				return this.$http('/balance/withdraw/list', 'GET', {
					page: this.page,
					per_page: this.per_page
				}).then(res => {
					this.page++
					this.list.push(...res.data.list)
					this.loading = false
					this.init = true
				})
			}
		}
	}
</script>

<style lang="scss">
	.list {
		margin: 0 24rpx;
		padding-bottom: 180rpx;
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
		font-size: 40upx;
		.value {
			font-weight: 500;
			text-align: right;
		}
		.status {
			font-size: 24rpx;
			text-align: right;
			
			&.pending {
				color: #FFCC00;
			}
			
			&.completed {
				color: #2BA246;
			}
		}
	}
</style>
