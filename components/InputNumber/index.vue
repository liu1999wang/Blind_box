<template>
	<view class="input-number bg-white" :class="size">
		<view class="sub-btn content-center" @tap="handleSub"><text>-</text></view>
		<input type="number" :value="num" @change="change"/>
		<view class="add-btn content-center" @tap="handleAdd"><text>+</text></view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Number,
				default: 1
			},
			size: {
				type: String
			},
			max: {
				type: Number
			},
			min: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				num: this.value
			}
		},
		methods: {
			change(e) {
				if (e.detail.value === this.value) return
				this.$emit("change", e.detail.value)
			},
			handleAdd() {
				if (this.max && this.num >= this.max) {
					
				} else {
					this.num++
					this.$emit("change", this.num)
				}
			},
			handleSub() {
				if (this.num > this.min) {
					this.num--
					this.$emit("change", this.num)
				}
			},
		}
	}
</script>

<style lang="scss">
	.input-number {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 100rpx;
		box-sizing: border-box;
		// width:140rpx;
		height:44rpx;
		border:1rpx solid rgba(225,225,225,1);
		border-radius:22rpx;
		
		color: #393939;
		
		.sub-btn, .add-btn {
			width: 70upx;
			height: 100%;
			line-height: 1;
			// background-color: #f5f5f5;
			font-size: 32upx;
			color: #000;
			// border-radius: 3px;
			// background-color: #eee;
		}
		
		.sub-btn {
			border: 5px 0 0 5px;
		}
		
		.add-btn {
			border: 0 5px 5px 0;
		}
		
		input {
			margin: 0 10upx;
			flex: 1;
			height: 100%;
			text-align: center;
		}
		
		&.small {
			width: 170upx;
			height: 50upx;
			
			.sub-btn, .add-btn {
				width: 50upx;
				font-size: 30upx;
			}
			
			input {
				height: 50upx;
				font-size: 28upx;
			}
		}
	}
</style>
