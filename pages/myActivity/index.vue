<template>
	<view class="container">
		<view class="header-tabs">
			<view class="tab-item" v-for="(item, index) in typeTextList" :class="{active:current==index}" :data-current="index" @tap="currentChange">
				{{item}}
			</view>
		</view>
		<view class="swiper-wrapper">
			<swiper :current="current" @change="currentChange2">
				<swiper-item v-for="(item, index) in types" :key="index">
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<view class="list">
							<ActivityItem v-for="item in dataList[index].list" :info="item" :key="item.uuid"></ActivityItem>
							<view class="load-more margin-v" v-if="dataList[index].list.length < dataList[index].total">加载中...</view>
							<NoData v-if="dataList[index].init&&!dataList[index].list.length" tips="无订单"></NoData>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<IActionSheet :visible="visible" @visibleChange="visibleChange" @change="cancelOrder" :list="reasons" title="选择理由"></IActionSheet>
	</view>
</template>

<script>
	import ActivityItem from "./components/ActivityItem.vue";
	import IActionSheet from "../../components/ActionSheet/index.vue";
	import NoData from "../../components/NoData/NoData.vue";
	export default {
		components: {
			ActivityItem,
			IActionSheet,
			NoData
		},
		data() {
			return {
				order: {},
				reasons: [],
				visible: false,
				dataList: [],
				current: 0,
				types: ["working", "expired"],
				typeTextList: ['进行中', '已结束']
			}
		},
		onLoad(e) {
			this.current = e.current ? parseInt(e.current) : 0
			this.initData()
			this.getOrderList()
		},
		onUnload() {
		},
		methods: {
			scrolltolower() {
				this.dataList[this.current].page++
				this.getOrderList()
			},
			initData() {
				this.dataList = []
				this.types.forEach(item => {
					this.dataList.push({
						list: [],
						type: item,
						page: 1,
						per_page: 50,
						total: 0,
						init: false,
						loading: false
					})
				})
			},
			currentChange(e) {
				let index = e.currentTarget.dataset.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					console.log(itemList)
					if (!itemList.init) {
						this.getOrderList()
					}
				}
			},
			currentChange2(e) {
				let index = e.detail.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					if (!itemList.init) {
						this.getOrderList()
					}
				}
			},
			getOrderList() {
				let itemList = this.dataList[this.current]
				if (itemList.loading) return
				if (!itemList.init) {
					uni.showLoading({
						title: '加载中',
						mask: true
					})
				}
				itemList.loading = true
				this.$http('/activity-records', 'GET', {
					status: itemList.type,
					page: itemList.page,
					per_page: itemList.per_page
				}).then(res => {
					uni.hideLoading()
					itemList.loading = false
					itemList.list.push(...res.data.list)
					itemList.total = res.data.item_total
					itemList.init = true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			color: #A5A7B2;
			font-weight: bold;

			&.active {
				color: #0E151D;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					height: 2px;
					left: 20rpx;
					right: 20rpx;
					bottom: 0;
					background-color: #0E151D;
				}
			}
		}
	}

	.swiper-wrapper {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
		padding-top: 90rpx;
		background-color: white;

		swiper,
		scroll-view {
			width: 100%;
			height: 100%;

			.list {
				overflow: hidden;
				padding: 0rpx 30rpx;

				.load-more {
					height: 100rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 32rpx;
					color: #888;
				}
			}
		}
	}
</style>
