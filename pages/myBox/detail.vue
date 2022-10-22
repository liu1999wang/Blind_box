<template>
	<view class="container">

		<view class="products-c">
			<SkuItem class="sku" :info="info"></SkuItem>
		</view>

		<view class="price-wrap padding-h">
			<view class="list-item">
				<view class="body">
					物品SID
				</view>
				<view class="arrow-right">
					{{info.sid}} <text style="color:#1890FF; margin-left: 10rpx;" @tap="setCopyText(info.sid)">复制</text>
				</view>
			</view>
			<view class="list-item">
				<view class="body">
					活动类型
				</view>
				<view class="arrow-right">
					<view class="node-type">
						{{info.node_type_text}}
					</view>
				</view>
			</view>
			<view class="list-item" v-if="info.options && info.options.node_title">
				<view class="body">
					活动名称
				</view>
				<view class="arrow-right">
					{{info.options.node_title}}
				</view>
			</view>
			<view class="list-item" v-if="info.options && info.options.shang_title">
				<view class="body">
					赏类型
				</view>
				<view class="arrow-right">
					<view class="shang-title">
						{{info.options.shang_title}}
					</view>
				</view>
			</view>
			<view class="list-item" v-if="info.options && info.options.room_num">
				<view class="body">
					房间号
				</view>
				<view class="arrow-right">
					第{{info.options.room_num}}房间
				</view>
			</view>
			<view class="list-item" v-if="info.options && info.options.session">
				<view class="body">
					活动期数
				</view>
				<view class="arrow-right">
					第{{info.options.session}}期
				</view>
			</view>
			<view class="list-item" v-if="info.options && info.options.ticket_number">
				<view class="body">
					抽奖码
				</view>
				<view class="arrow-right">
					{{info.options.ticket_number}}
				</view>
			</view>
			<view class="list-item">
				<view class="body">
					物品价值
				</view>
				<view class="arrow-right">
					<PriceDisplay :info="info"></PriceDisplay>
				</view>
			</view>
			<view class="list-item">
				<view class="body">
					物品状态
				</view>
				<view class="arrow-right">
					{{info.union_status_text}}
				</view>
			</view>
			<view class="list-item" v-if="info.created_at">
				<view class="body">
					获得时间
				</view>
				<view class="arrow-right">
					{{info.created_at}}
				</view>
			</view>
		</view>

		<view class="meta-c padding-h" v-if="info.return_saled_at">
			<view class="list-item" v-if="info.return_saled_at">
				<view class="body">
					回收时间
				</view>
				<view class="arrow-right">
					{{info.return_saled_at}}
				</view>
			</view>
			<view class="list-item" v-if="info.return_score">
				<view class="body">
					回收获得{{scoreAlias}}
				</view>
				<view class="arrow-right">
					{{info.return_score}}{{scoreAlias}}
				</view>
			</view>
			<view class="list-item" v-if="info.return_redpack">
				<view class="body">
					回收获得红包
				</view>
				<view class="arrow-right">
					{{info.return_redpack / 100}}元
				</view>
			</view>
			<view class="list-item" v-if="info.return_money">
				<view class="body">
					回收原路退回
				</view>
				<view class="arrow-right">
					{{info.return_money / 100}}元
				</view>
			</view>
		</view>
		
		<view class="meta-c padding-h" v-if="info.sku_type_text==='virtual_asset' && info.assets">
			<view class="list-item" v-if="info.assets.is_score">
				<view class="body">
					{{scoreAlias}}数量
				</view>
				<view class="arrow-right">
					{{info.assets.score}} x{{info.total}}份 <text @tap="checkScore" v-if="info.union_status === 'picked'" style="color:#1890FF; margin-left: 10rpx;">查看</text>
				</view>
			</view>
			<view class="list-item" v-if="info.assets.is_redpack">
				<view class="body">
					红包数量
				</view>
				<view class="arrow-right">
					{{info.assets.redpack / 100}}元 x{{info.total}}份 <text @tap="checkRedpack" v-if="info.union_status === 'picked'" style="color:#1890FF; margin-left: 10rpx;">查看</text>
				</view>
			</view>
			<view class="list-item" v-if="info.assets.is_level_score">
				<view class="body">
					成长值数量
				</view>
				<view class="arrow-right">
					{{info.assets.level_score / 100}}元 x{{info.total}}份
				</view>
			</view>
			<view class="list-item" v-if="info.assets.is_show_box_card">
				<view class="body">
					透视卡数量
				</view>
				<view class="arrow-right">
					{{info.assets.show_box_card}}张 x{{info.total}}份
				</view>
			</view>
			<view class="list-item" v-if="info.assets.is_exclude_box_card">
				<view class="body">
					排除卡数量
				</view>
				<view class="arrow-right">
					{{info.assets.exclude_box_card}}张 x{{info.total}}份
				</view>
			</view>
			<view class="list-item" v-if="info.assets.is_chip">
				<view class="body">
					碎片数量
				</view>
				<view class="arrow-right">
					{{info.assets.chip_total}}块{{info.assets.chip_title}} x{{info.total}}份 <text @tap="checkChip" v-if="info.union_status === 'picked'" style="color:#1890FF; margin-left: 10rpx;">查看</text>
				</view>
			</view>
		</view>
		
		<view class="detail-image-c" v-if="info.detail_images">
			<image :src="url" mode="widthFix" class="image" v-for="url in info.detail_images"></image>
		</view>

		<!-- <view style="height: 150upx;"></view> -->

		<!-- <view class="footer-actions safe-area-bottom">
			<button class="action-item no-border-button" open-type="contact" @tap="openContact">
				<view class="icon new-iconfont icon-contact"></view>
				<text>客服</text>
			</button>
			<navigator class="action-item" hover-class="hover" :url="`/pages/orderCode/index?uuid=${order.uuid}`" v-if="order.union_status=='deliver_pending' && order.is_offline_useable">
				<view class="icon new-iconfont icon-qrcode"></view>
				<text>核销码</text>
			</navigator>
		</view> -->
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js"
	import IActionSheet from "@/components/ActionSheet/index.vue";

	export default {
		mixins: [mixin],
		components: {
			IActionSheet
		},
		data() {
			return {
				deliverRecord: null,
				info: {},
				uuid: '',
			}
		},
		filters: {
			hidePhoneDetail(value) {
				return value ? value.substring(0, 3) + '****' + value.substring(7, 11) : ''
			}
		},
		computed: {
			orderConfig() {
				return this.$store.getters.setting.order
			},
		},
		onLoad(e) {
			this.uuid = e.uuid
		},
		onShow() {
			this.getOrderInfo()
		},
		methods: {
			checkChip() {
				uni.navigateTo({
					url: '/pages/myChip/index'
				})
			},
			checkRedpack() {
				uni.navigateTo({
					url: '/pages/myRedpack/index'
				})
			},
			checkScore () {
				uni.navigateTo({
					url: '/pages/myScore/index'
				})
			},
			openContact() {
				// #ifdef MP-ALIPAY
				let name = this.$store.getters.setting.taobao.contact_name || '未设置昵称'
				my.tb.openMessage({
					sellerNick: name,
					success: (res) => {
						console.log(res);
					},
					fail: (res) => {
						console.log(res);
					},
				})
				// #endif
			},
			setCopyText(text) {
				uni.setClipboardData({
					data: text,
					success: function(res) {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},
			getOrderInfo() {
				let uuid = this.uuid
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$http(`/asset/package-skus/${this.uuid}`).then(res => {
					this.info = res.data.info
					
					uni.hideLoading()
				})
			},
			visibleChange() {
				this.visible = !this.visible
			},
			payNow() {
				uni.navigateTo({
					url: '/pages/payCenter/index?uuid=' + this.order.uuid
				})
			}
		},

	}
</script>

<style lang="scss">
	page {
		background: #fafafa;
	}

	.shang-title {
		background: #FCF6D8;
		color: #F58348;
		padding: 4rpx 10rpx;
		font-size: 24rpx;
		border-radius: 6rpx;
		margin-left: 10rpx;
	}
	
	.node-type {
		background: #FCF6D8;
		color: #F58348;
		padding: 4rpx 10rpx;
		font-size: 24rpx;
		border-radius: 6rpx;
		margin-left: 10rpx;
	}

	button {
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: transparent;

		&::after {
			border: none;
			display: none;
		}

		&::before {
			display: none;
		}
	}

	.list-item {
		display: flex;
		align-items: center;
		position: relative;

		.status-text {
			font-weight: 500;
		}
	}

	.list-item .body {
		flex: 1;
		display: flex;
		align-items: center;
		font-weight: 500;
	}

	.list-item-title {
		flex: 1;
	}

	.address-c {
		display: flex;
		background: white;

		.al-icon-coordinates {
			margin-top: 6upx;
		}

		.body {
			margin-left: 30upx;

			.name {
				font-size: 30upx;
				font-weight: 500;
			}

			.detail {
				margin-top: 10upx;
				font-size: 26upx;
				color: #777;
			}
		}
	}

	.products-c {
		background: white;
		margin-top: 20rpx;
	}

	.price-wrap {
		background: white;
		padding-top: 20upx;
		margin-top: 20rpx;
	}

	.list-item {
		height: 80upx;
		font-size: 28upx;

		.arrow-right {
			font-size: 26upx;
			font-weight: bold;
		}
	}

	.total-price {
		margin-top: 20upx;
		position: relative;
		line-height: 90upx;
		text-align: right;
		font-size: 32upx;
		font-weight: 500;

		.key {
			font-size: 28rpx;
		}

		.price-c {
			color: red;
			display: inline;
		}
	}

	.meta-c {
		padding-top: 20upx;
		padding-bottom: 20upx;
		background: white;
		margin-top: 20rpx;

		.list-item .arrow-right {
			font-weight: 400;
		}

		.status-text {
			font-weight: 500;
		}
	}

	.footer {
		display: none;
		width: 100%;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		box-shadow: 0 -6upx 8upx rgba(206, 206, 206, 0.2);

		.content {
			padding: 20upx 30upx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		min-height: 130rpx;

		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx 100rpx 30rpx;
		background-color: #fff;

		.action-item {
			// line-height: transparent;
			height: 100rpx;
			width: 120rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			.icon {
				font-size: 42rpx;
				line-height: 46rpx;
			}

			text {
				font-size: 22rpx;
				line-height: 30rpx;
			}
		}

		.btn {
			width: 238rpx;
			height: 78rpx;
			// border: 2rpx solid rgba(242, 114, 51, 1);
			border-radius: 40rpx;
			color: #F27233;
			font-size: 26rpx;
			text-align: center;
			line-height: 78rpx;
			margin-left: 30rpx;
			font-weight: 500;

			&.bg-orange {
				background: rgba(242, 114, 51, 1);
				color: #FFFFFF;
			}

			&.btn-full {
				width: 600rpx;
			}
		}
	}
	
	.detail-image-c {
		margin-top: 30rpx;
		background: white;
		padding: 20rpx 10rpx 100rpx 10rpx;
		.image {
			width: 100%;
			display: block;
		}
	}
</style>
