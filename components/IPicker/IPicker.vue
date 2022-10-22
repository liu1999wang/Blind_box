<template>
	<picker :value="index" range-key="label" :range="list" @change="bindPickerChange">
		<view class="uni-input content-c">
			<text v-if="index > -1">
				{{list[index].label}}
			</text>
			<text class="tips-text" v-else>
				请选择
			</text>
			<text v-if="rightIcon" class="new-iconfont icon-arrow-right"></text>
		</view>
	</picker>
</template>

<script>
	export default {
		props: {
			value: {
				default () {
					return ''
				}
			},
			list: {
				type: Array,
				default () {
					return []
				}
			},
			rightIcon: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		data() {
			return {
				index: -1
			}
		},
		mounted() {
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].key == this.value) {
					this.index = i
					return true
				}
			}
		},
		watch: {
			value(val) {
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].key === val) {
						this.index = i
						return true
					}
				}
			}
		},
		methods: {
			bindPickerChange(e) {
				this.index = e.target.value
				this.$emit('input', this.list[this.index].key)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tips-text {
		color: #888;
	}
	.icon-arrow-right {
		font-size: 40rpx;
		color: #aaa;
		position: relative;
		top: 6rpx;
	}
</style>
