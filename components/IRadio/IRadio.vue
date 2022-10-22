<template>
	<radio-group @change="bindPickerChange">
		<label class="uni-list-cell uni-list-cell-pd label-item" v-for="(item, index) in list" :key="item.key">
			<radio color="#FFCC00" :value="item.key" :checked="item.key === value" />
			<text>{{item.label}}</text>
		</label>
	</radio-group>
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
				// for (let i = 0; i < this.list.length; i++) {
				// 	if (this.list[i].key === val) {
				// 		this.index = i
				// 		return true
				// 	}
				// }
			}
		},
		methods: {
			bindPickerChange(e) {
				this.$emit('input', e.detail.value)
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
	
	.label-item {
		margin-right: 30rpx;
		
		radio {
			scale: 0.8;
		}
	}
</style>
