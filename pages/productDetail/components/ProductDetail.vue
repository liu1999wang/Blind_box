<template>
	<view class="product-detail">
		<view v-for="(item,index) in source" :style="'margin-top:'+item.style.margin_top+'px;padding:0 '+item.style.padding+'px;'" :key="index">
			<view class="rich-text" v-if="item.type==='richtext'">
				<HTML :html="item.content"></HTML>
			</view>
			<view class="images" v-if="item.type==='imageList'" >
				<image :src="img" mode="widthFix" v-for="(img, i) in item.images" :key="img" @tap="previewImage(item.images, i)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ProductDetail",
		props: {
			source: Array
		},
		methods: {
			previewImage (urls, current) {
				uni.previewImage({
					urls: urls,
					current: current
				})
			},
		}
	}
</script>

<style lang="scss">
	.images {
		image {
			display: block;
			width: 100%;
		}
	}
</style>
