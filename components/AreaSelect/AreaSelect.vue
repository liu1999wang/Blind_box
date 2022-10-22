<template>
	<view class="content">
		<view  @tap="openAddres" v-if="pickerText">{{pickerText}}</view>
		<view  @tap="openAddres" v-else class="empty-tips">点击选择地址</view>
<!-- 		<button class="btns" type="primary" @tap="openAddres">默认打开地址</button>

		<button class="btns" type="default" @tap="openAddres2">自定义：根据省市区名称打开地址</button>

		<button class="btns" type="warn" @tap="openAddres3">自定义：根据省市区“code”打开地址</button>
		<textarea v-model="pickerText" cols="30" rows="10"></textarea> -->
		<!--
	         mask-bg-color="rgba(0, 229, 238, 0.4)" // 自定义遮罩层背景颜色
	         -->
		<simple-address class="address-c" confirmColor="#87cc6e" cancelColor="#b4b4b4" ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
	import simpleAddress from './simple-address.nvue';
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				labelArr: []
			};
		},
		props: {
			value: {
				type: Array
			}
		},
		components: {
			simpleAddress
		},
		computed: {
			pickerText () {
				return this.labelArr && this.labelArr.join('-')
			}
		},
		mounted () {
			if (this.value)
				this.labelArr = this.value
		},
		watch: {
			labelArr () {
				this.cityPickerValueDefault = this.$refs.simpleAddress.queryIndex(this.labelArr, 'label').index
			}
		},
		methods: {
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.labelArr = e.labelArr;
				this.$emit('change', e)
			}
		}
	};
</script>

<style scoped lang="scss">
	
	.content {
		padding-left: 14rpx;
		font-size: 28rpx;
		color: #999;
	}
	.address-c {
		width: 100%;
	}
	.empty-tips {
		color: gray;
	}
</style>
