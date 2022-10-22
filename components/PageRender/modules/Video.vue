<template>
	<view class="list">
		<video class="video" :autoplay="module.is_autoplay" controls :src="module.video" poster="module.thumb"></video>
	</view>
</template>

<script>
	export default {
		props: {
			module: {
				type: Object,
				default () {
					return {

					}
				}
			}
		},
		data() {
			return {}
		},
		computed: {
		},
		mounted() {
		},
		watch: {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.video {
		width: 100%;
		// height: auto;
	}
</style>
