<template>
	<view class="box-c">
		<image mode="aspectFill" :src="config.item_1 || 'https://cdn2.hquesoft.com/box/detail/3d-1.png'" class="item-3d item-1"></image>
		<image mode="aspectFill" :src="config.item_2 || 'https://cdn2.hquesoft.com/box/detail/3d-2.png'" class="item-3d item-2"></image>

		<image :src="boxBottomImage" class="box-bg"></image>

		<view class="small-box-c" :class="'number' + room.sku_status.length">
			<image v-if="index < 9 && !item" v-for="(item, index) in room.sku_status" :key="index" @tap="selectItem(index)"
			 :class="'item-'+(index+1) +  (index === selected ? ' selected' : '')" :src="smallBoxImage" mode="widthFix">
			</image>
		</view>

		<image :src="boxTopImage" class="box-bg-up"></image>

		<image mode="aspectFill" v-if="config.item_3" :src="config.item_3" class="item-3d item-3"></image>

		<image src="https://bus-cdn.hquesoft.com/box/click-tips.png" class="click-tips" v-if="isShowClickTips"></image>
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
			return {
				selected: -1,
				isShowClickTips: false
			}
		},
		created() {
			this.isShowClickTips = !uni.getStorageSync('disableShowClickTips')
		},
		computed: {
			config() {
				return this.$store.getters.setting.box_room
			},
			boxBottomImage() {
				return this.info.big_box_bottom || this.config.box_bottom || 'https://cdn2.hquesoft.com/box/bigBox/3d-bg.png'
			},
			boxTopImage() {
				return this.info.big_box_top || this.config.box_up || 'https://cdn2.hquesoft.com/box/bigBox/3d-bg-up.png'
			},
			smallBoxImage() {
				return this.info.small_box_image || this.config.small_box || 'https://cdn2.hquesoft.com/box/bigBox/small-box.png'
			},
		},
		methods: {
			selectItem(index) {
				if (this.isShowClickTips) {
					this.isShowClickTips = false
					uni.setStorageSync('disableShowClickTips', true)
				}
				
				if (this.selected !== index) {
					this.selected = index
					
					this.$playAudio('check')
				} else {
					this.$emit('select', index)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-c {
		width: 100%;
		// position: relative;
		// left: 0;
		width: 750rpx;
		height: 700rpx;
		position: relative;

		.box-bg {
			width: 592rpx;
			height: 602rpx;
			position: absolute;
			left: 35rpx;
			top: 40rpx;
		}

		@keyframes warn {
			0% {
				transform: scale(0.8);
				opacity: 0.8;
			}
			
			50% {
				transform: scale(1.1);
				opacity: 1;
			}

			100% {
				transform: scale(0.8);
				opacity: 0.8;
			}
		}

		.click-tips {
			width: 234rpx;
			height: 196rpx;
			position: absolute;
			left: 150rpx;
			top: 364rpx;
			pointer-events: none;
			animation: warn 2.6s ease-out 0s infinite;
		}

		.box-bg-up {
			width: 658rpx;
			height: 380rpx;
			position: absolute;
			left: 63rpx;
			top: 364rpx;
			pointer-events: none;
		}

		.item-3d {
			position: absolute;

			&.item-1 {
				width: 426rpx;
				height: 448rpx;
				left: -50rpx;
				top: -20rpx;
			}

			&.item-2 {
				width: 314rpx;
				height: 480rpx;
				right: 0rpx;
				top: 0rpx;
			}

			&.item-3 {
				width: 286rpx;
				height: 516rpx;
				right: 0rpx;
				bottom: -180rpx;
				pointer-events: none;
			}
		}

		.small-box-c {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0rpx;
			top: 48rpx;

			-webkit-clip-path: polygon(0 100%, 100% 100%, 100% 50rpx, 50rpx 0, 0 50rpx);
			clip-path: polygon(0 100%, 100% 100%, 100% 50rpx, 50rpx 0, 0 50rpx);

			image {
				width: 163rpx;
				position: absolute;

				&.item-1 {
					left: 236rpx;
					top: 218rpx;
				}

				&.item-2 {
					left: 336rpx;
					top: 255rpx;
				}

				&.item-3 {
					left: 436rpx;
					top: 292rpx;
				}

				&.item-4 {
					left: 173rpx;
					top: 262rpx;
				}

				&.item-5 {
					left: 273rpx;
					top: 299rpx;
				}

				&.item-6 {
					left: 373rpx;
					top: 336rpx;
				}

				&.item-7 {
					left: 111rpx;
					top: 306rpx;
				}

				&.item-8 {
					left: 211rpx;
					top: 343rpx;
				}

				&.item-9 {
					left: 311rpx;
					top: 380rpx;
				}

				&.selected {
					transform: translateY(-30rpx);
				}
			}
		}
	}
</style>
