<template>
	<view class="rule">
		<radio @tap="uncheck" value="cb" :checked="isCheck" color="#ef563d" style="transform:scale(0.7); position: relative; top: -2rpx;" />
		我已阅读并同意 <navigator url="/pages/rule/userStatement" class="link"> 《用户使用协议》</navigator>
	</view>
</template>

<script>
	export default {
		props: {
			value: Boolean
		},
		data() {
			return {
				isCheck: true,
			}
		},
		mounted() {
			this.$emit('input', this.isCheck)
		},
		watch: {
			isCheck (value) {
				this.$emit('input', this.isCheck)
			}
		},
		computed: {
		},
		methods: {
			uncheck () {
				this.isCheck = !this.isCheck
			},
			checkChange (e) {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.rule {
	font-size: 24rpx;
	text-align: center;
	
	.link {
		display: inline;
		color: #ef563d;
		text-decoration: underline;
	}
}
</style>
