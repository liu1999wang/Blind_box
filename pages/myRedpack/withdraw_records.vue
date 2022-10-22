<template>
	<view class="container">
		<view class="list">
			<view class="list-item" v-for="item in list" :key="item.uuid">
				<view class="list-body">
					<view class="action">
						转售-{{item.sid}}
					</view>
					<view class="number">
					
					</view>
					<view class="date-time">
						{{item.created_at}}
					</view>
				</view>
				<view class="right">
					<view class="value">{{$tool.formatPrice(item.money_price)}}</view>
					<view class="status" :class="item.union_status">{{item.union_status_text}}</view>
				</view>
			</view>
		</view>
		<!-- <NoData></NoData> -->
		<NoData v-if="!list.length && init"></NoData>
		<view class="footer safe-area-bottom">
			<navigator url="/pages/myRedpack/withdraw" class="footer-button" >
				<view>
					<text>提现</text>
				</view>
			</navigator>
		</view>
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
				return this.$http('/status-total/withdraw_records', 'GET', {
					page: this.page,
					per_page: this.per_page
				}).then(res => {
					console.log(JSON.stringify(res.data))
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
	.footer {
		// display: none;
		position: fixed;
		bottom: 20rpx;
		left: 75rpx;
		width: 100%;
		// background-color: #f5f5f5;
		display: flex;
		width: 600rpx;
	
	
		.footer-button {
			flex: 1;
			margin: 0 auto;
			margin-bottom: 10rpx;
			// width: 600rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #000000;
			box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.6);
			// border-radius: 80rpx;
			view{
				background-color: #000000;
				color: white;
			}
			&.last-btn {
				margin-left: 30rpx;
			}
	
			&.bg-purple {
				box-shadow: 0 0 20rpx rgba(81, 81, 149, 0.6);
			}
		}
	}
</style>
