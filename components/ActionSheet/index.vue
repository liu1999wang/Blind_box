<template>
	<view class="action-sheets mask" :hidden="!visible" @tap="visibleChange">
		<view class="result-content" @tap.stop>
			<view class="title border-bottom">{{title}}</view>
			<view class="result-list safe-area-bottom">
				<view class="result-item border-bottom" hover-class="hover" v-for="(item,index) in list" :key="item" :data-index="index" @tap="handleClick">{{item}}</view>
				<view class="cancel-btn red" @tap="visibleChange">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ActionSheet",
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array,
				default() {
					return []
				}
			},
			title: {
				type: String,
				default: '标题'
			}
		},
		methods: {
			handleClick(e) {
				this.$emit('change', e.currentTarget.dataset.index)
			},
			visibleChange() {
				this.$emit('visibleChange')
			}
		}
	}
</script>

<style lang="scss">
	.result-content {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: center;
		line-height: 90upx;
	
		.title {
			font-size: 30upx;
			font-weight: bold;
			position: relative;
		}
	
		.result-item {
			position: relative;
			font-size: 28upx;
			
			&:after {
				background-color: #eeeeee;
			}
		}
		
		.hover {
			background-color: #f5f5f5;
		}
	}
</style>
