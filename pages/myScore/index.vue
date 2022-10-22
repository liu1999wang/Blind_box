<template>
	<view class="container">
		<view class="content-box">
			<!-- <image class="user-headimg" :src="userInfo.headimg" mode="aspectFill"></image> -->
			<view class="score">
				我的{{scoreAlias}}: {{userInfo.score}}
			</view>
		</view>
		<view class="title">
			<text>{{scoreAlias}}明细</text>
		</view>
		<view class="list">
			<view class="list-item" v-for="item in list" :key="item.uuid">
				<view class="list-body">
					<view class="action">
						{{item.description}}
					</view>
					<view class="order-number" v-if="item.order_number">
						订单号:{{item.order_number}}
					</view>
					<view class="date-time">
						{{item.created_at}}
					</view>
				</view>
				<view class="right">
					<text class="red" v-if="item.type === 1">+{{item.value}}</text>
					<text class="gray" v-else>-{{item.value}}</text>
				</view>
			</view>
		</view>
		<NoData v-if="!list.length && init"></NoData>
		
		<navigator url="/pages/myScore/buy" v-if="isBuyEnabled">
			<view class="footer safe-area-bottom">
				<view class="footer-button" hover-class="hover">
					<text>充值</text>
				</view>
			</view>
		</navigator>
		
	</view>
</template>

<script>
	import {
		getScoreRecord
	} from "../../api/user.js"
	
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
			},
			setting() {
				return this.$store.getters.setting.score || {}
			},
			isBuyEnabled () {
				return this.setting.is_buy_enabled
			}
		},
		async onLoad() {
			
			this.$store.dispatch("getUserInfo")
			
			uni.showLoading({
				title: '加载中'
			})
			const res = await this.getScoreRecord()
			uni.hideLoading()
			this.init = true
			this.list.push(...res.data.list)
			this.total = res.data.item_total
			
			uni.setNavigationBarTitle({
				title: '我的' + this.scoreAlias
			})
		},
		async onReachBottom() {
			if(this.loading) return
			this.loading = true
			this.page++
			const res = await this.getScoreRecord()
			this.loading = false
			this.list.push(...res.data.list)
		},
		methods: {
			async getScoreRecord() {
				return await getScoreRecord({
					page: this.page,
					per_page: this.per_page
				})
			}
		}
	}
</script>

<style lang="scss">
	.footer {
		// display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		// background-color: #f5f5f5;
	
		.footer-button {
			margin: 0 auto;
			margin-bottom: 10rpx;
			width: 600rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			border-radius: 80rpx;
		}
	}
	
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
			font-weight: 900;
			color: #000000;
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
		
		.order-number {
			font-size: 26rpx;
			margin-top: 6rpx;
		}
		
		.date-time {
			font-size: 24upx;
			margin-top: 6upx;
		}
	}
	
	.list-body {
		flex: 1;
	}


	.right {
		font-size: 40upx;
	}
</style>
