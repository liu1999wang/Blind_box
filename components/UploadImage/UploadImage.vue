<template>
	<view class="container">
		<view class="images">
			<view class="img-item" v-for="(item, index) in images" :key="item">
				<image :src="item" mode="aspectFill" @tap="$tool.previewImage(images, index)"></image>
				<text class="new-iconfont icon-trash" @tap.stop="deleteByIndex(index)"></text>
			</view>
			<view class="add-btn" @tap="handleAddImages" v-if="mode=='multi' || (mode=='single' && images.length === 0)">+</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Banner",
		props: {
			value: {
				type: Array || String
			},
			count: {
				type: Number,
				default () {
					return 5
				}
			},
			mode: {
				type: String,
				default () {
					return 'multi'
				}
			}
		},
		data() {
			return {
				images: []
			}
		},
		mounted() {
			this.images = this.value
		},
		watch: {
			images(val) {
				// console.log('image变动', val)
				if (this.mode === 'multi') {
					this.$emit('input', val)
				}
				else {
					this.$emit('input', val[0] || '')
				}
			}
		},
		methods: {
			handleAddImages() {
				this.$upload.select({
					count: this.count,
					sizeType: ['compressed'],
				}, urls => {
					
					// console.log(urls)
					
					if (this.mode === 'multi') {
						this.images = this.images.concat(urls)
					}
					else {
						this.images = urls
					}
					
					// this.images = this.images.concat(urls)
					//console.log(this.value)
				})
			},
			deleteByIndex(index) {
				this.images.splice(index, 1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.images {
			display: flex;
			flex-wrap: wrap;
			.add-btn {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 150rpx;
				height: 150rpx;
				border-radius: 8rpx;
				border: 1px dashed #ddd;
				text-align: center;
				line-height: 150rpx;
				font-size: 50rpx;
				color: #bbbbbb;
			}
			.img-item {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 150rpx;
				height: 150rpx;
				border-radius: 8rpx;
				position: relative;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
				.icon-trash {
					position: absolute;
					bottom: 0;
					right: 0;
					color: #FFFFFF;
					background-color: #0E151D;
					width: 50rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;
					font-size: 30rpx;
					border-radius: 8rpx 0 0 0;
				}
			}
		}
	}
</style>
