<template>
	<view>
		<view class="swiperPanel" @touchstart="startMove" @touchend="endMove">
			<view class="swiperItem" v-for="(item, index) in skus" :key="index" :style="{transform: itemStyle[index].transform, zIndex: itemStyle[index].zIndex, opacity: itemStyle[index].opacity}">
				<view class="children">
					<image class="thumb" mode="aspectFit" :src="item.thumb"></image>
					<view class="title">{{item.title}}</view>
					<view class="price">价值{{item.money_price / 100}}元</view>
					<view class="stock">剩余可兑换份数: {{item.stock}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			skus: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0
				},
				screenWidth: 0,
				itemStyle: []
			};
		},
		computed: {
			swiperList () {
				return  this.skus
			},
			currentSku () {
				let topObject = this.itemStyle[0]  || {}
				let topIndex = 0

				this.itemStyle.forEach((item, index) => {
					// console.log('zIndex 对比 ====>', item.zIndex, topObject.zIndex)
					// topObject = item.zIndex > topObject.zIndex ? item : topObject
					if (item.zIndex > topObject.zIndex) {
						topObject = item
						topIndex = index
					}
				})

				return this.skus[topIndex]
			}
		},
		watch: {
			currentSku () {
				this.$emit('skuChange', this.currentSku)
			}
		},
		created() {
			var macInfo = uni.getSystemInfoSync();
			this.screenWidth = macInfo.screenWidth;
			// 计算swiper样式
			this.swiperList.forEach((item, index) => {
				this.itemStyle.push(this.getStyle(index, item))
			})
		},
		methods: {
			getStyle(e, sku) {
				if (e > this.swiperList.length / 2) {
					var right = this.swiperList.length - e
					return {
						transform: 'scale(' + (1 - right / 10) + ') translate(-' + (right * 20) + '%,0px)',
						zIndex: 9999 - right,
						opacity: 0.8 / right,
						skuId: sku.id
					}
				} else {
					return {
						transform: 'scale(' + (1 - e / 10) + ') translate(' + (e * 20) + '%,0px)',
						zIndex: 9999 - e,
						opacity: 0.8 / e,
						skuId: sku.id
					}
				}
			},
			startMove(e) {
				this.slideNote.x = e.changedTouches[0] ? e.changedTouches[0].pageX : 0;
				this.slideNote.y = e.changedTouches[0] ? e.changedTouches[0].pageY : 0;
			},
			endMove(e) {
				var newList = JSON.parse(JSON.stringify(this.itemStyle))
				if ((e.changedTouches[0].pageX - this.slideNote.x) < 0) {
					// 向左滑动
					var last = [newList.pop()]
					newList = last.concat(newList)
				} else {
					// 向右滑动
					newList.push(newList[0])
					newList.splice(0, 1)
				}
				this.itemStyle = newList
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiperPanel {
		margin: 0rpx 0;
		height: 630rpx;
		width: 100%;
		overflow: hidden;
		position: relative;

		.swiperItem {
			height: 100%;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			transition: all .5s;

			.children {
				// height: 100%;
				width: 540rpx;
				height: 660rpx;
				margin: 2rpx auto;
				// border: 1px solid red;
				background: url('https://cdn2.hquesoft.com/box/jika/big-item-bg.png');
				background-repeat: no-repeat;
				background-size: 100% auto;
				position: relative;
				// border: 1px solid red;

				.thumb {
					width: 360rpx;
					height: 310rpx;
					position: absolute;
					left: 90rpx;
					top: 96rpx;
					// border: 1px solid green;
					// height: 100%;
					// width: 100%;
					// border-radius: 20px;
					// box-shadow: 0 0 10px #333;
				}
				
				.title {
					font-size: 36rpx;
					font-family: PingFang;
					font-weight: bold;
					color: #FFFFFF;
					// border: 1px solid green;
					position: absolute;
					bottom: 190rpx;
					text-align: center;
					left: 90rpx;
					width: 350rpx;
					margin: 0rpx auto;
					height: 50rpx;
					overflow: hidden;
					// line-height: 101px;
				}
				.price {
					font-size: 26rpx;
					font-weight: bold;
					color: #F0FF70;
					line-height: 100rpx;
					position: absolute;
					bottom: 120rpx;
					text-align: center;
					left: 90rpx;
					width: 350rpx;
				}
				.stock {
					font-size: 24rpx;
					font-family: PingFang;
					font-weight: 500;
					color: #FFFFFF;
					position: absolute;
					bottom: 106rpx;
					text-align: center;
					left: 90rpx;
					width: 350rpx;
				}
			}
		}
	}
</style>
