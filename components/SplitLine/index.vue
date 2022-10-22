<template>
	<view class="split-line" :style="'height:' + height + 'px'"></view>
</template>

<script>
	export default {
		props: {
			height: {
				type: String,
				default: '12'
			}
		}
	}
</script>

<style lang="scss">
.split-line {
	height: 12px;
	background-color: #f8f8f8;
}
</style>
