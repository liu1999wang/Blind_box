<template>
	<view class="container">
		<view class="empty-top">授权中</view>
	</view>
</template>

<script>
	import $wechatJsTool from "@/utils/wechat.js"
	import {
		$getStorage,
		$setStorage
	} from "@/utils/auth.js";

	export default {
		name: "login",
		components: {},
		data() {
			return {
			}
		},
		created() {
			// 绑定微信
			$wechatJsTool.bindWechat()
		},
		onShow() {
		},
		computed: {
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 60rpx 60rpx;
		box-sizing: border-box;

		.empty-top {
			height: 20vh;
		}
	}
</style>
