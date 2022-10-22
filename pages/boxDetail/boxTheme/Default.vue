<template>
	<view class="box-c">
		<!-- <view class="header-img" :style="'background-image: url('+info.bg_image+');'"></view> -->
		<image mode="widthFix" class="header-img" :src="info.box_top_image"></image>
		<view class="body" :class="'number' + skuStatus.length">
			<view class="item" :class="{active:item===0}" v-for="(item, index) in skuStatus" :key="index"  hover-class="hover">
				<!-- <text class="num">{{index+1}}</text> -->
				<image v-if="item" src="https://cdn2.hquesoft.com/box/home/box-empty.png"></image>
				<image v-else :src="info.sku_thumb" mode="aspectFill" hover-class="hover" @tap="select(index)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			room: {
				type: Object
			},
			info: {
				type: Object
			}
		},
		data() {
			return {}
		},
		computed: {
			skuStatus () {
				return this.room.sku_status
				// return [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0]
			}
		},
		created() {},
		methods: {
			select (index)  {
				this.$playAudio('check')
				this.$emit('select', index)
			}
		}
	}
</script>

<style lang="scss">
	.box-c {
		width: 100%;
		min-height: 700rpx;
		// position: relative;
		// left: 0;

		.header-img {
			width: 100%;
			// height: 440rpx;
			margin-bottom: 0rpx;
			padding-bottom: 0rpx;
			display: block;
		}

		.body {
			margin-top: 0rpx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			background: rgba(0, 0,  0, 0.4);

			.item {
				width: 160rpx;
				height: 160rpx;

				box-sizing: border-box;
				border: 1rpx solid #f1f1f1;

				image {
					width: 100%;
					height: 100%;
				}
			}
			&.number4 {
				.item {
					width: 240rpx;
					height: 240rpx;
				}
			}
			&.number5,
			&.number6 {
				.item {
					width: 160rpx;
					height: 160rpx;
				}
			}
			&.number7,
			&.number8,
			&.number10,
			&.number11,
			&.number12 {
				.item {
					width: 120rpx;
					height: 120rpx;
				}
			}
		}
	}
</style>
