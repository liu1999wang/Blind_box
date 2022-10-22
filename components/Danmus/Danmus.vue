<template>
	<view class="danmus">
		<template v-if="isShow">
			<view class="danmu-item" @tap="clickItem(item)" v-for="(item,index) in danmus" :key="index"  :style="item.style">
				<image mode="aspectFill" :src="item.headimg" v-if="setting.is_headimg" class="headimg"></image>
				<text class="danmu-text" :style="'color:' + item.color">{{item.text}}</text>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: "Danmus",
		props: {
			list: Array,
			uuid: String,
			setting: Object
		},
		data() {
			return {
				danmus: [],
				customBar: 64,
				isShow: false
			}
		},
		// computed: {
		// 	customBar() {
		// 		return this.$store.getters.deviceInfo.customBar;
		// 	}
		// },
		watch: {
			list: {
				handler(value) {
					if (value) {
						this.start()
					}
				},
				deep: true
			}
		},
		created() {
			this.customBar = this.$store.getters.deviceInfo.customBar
			
			this.start()
		},
		methods: {
			start() {
				this.danmus = []
				this.isShow = false
				const list = this.list
				const danmus = []
				let maxTime = 0
				for(let i = 0; i < list.length; i++) {
					const top = this.customBar + (i%4) * (8 + 34)
					const duration = 9 + (Math.random() * 3)
					const delay = 0 + (Math.random() * 2) + i
					maxTime = maxTime > (duration + delay) ? maxTime : (duration + delay)
					danmus.push({
						...list[i],
						style: `background: ${list[i].bg_color};top:${top}px;animation-duration:${duration}s;animation-delay:${delay}s;`
					})
				}
				this.$forceUpdate()
				
				setTimeout(() => {
					this.danmus = danmus
					this.isShow = true
				}, 100)
				
				maxTime -= 2.5
				setTimeout(() => {
					this.start()
					this.$forceUpdate()
				}, parseInt(maxTime * 1000))
			},
			clickItem (item) {
				// 是当前同款盲盒，则不用跳转
				if (item.uuid === this.uuid) {
					return false
				}
				
				if (item.type === 'box') {
					uni.navigateTo({
						url: '/pages/boxDetail/index?uuid=' + item.uuid
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.danmu-item {
		z-index: 1000;
		position: fixed;
		white-space: nowrap;
		background-color: rgba(0, 0, 0, 0.4);
		color: #fff;
		height: 34px;
		line-height: 34px;
		border-radius: 17px;
		padding: 0 20rpx;
		font-size: 13px;
		animation-name: damumove;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
		// animation-iteration-count: infinite;
		overflow: hidden;
		left: 750rpx;
		// min-width: 100rpx;
		
		display: flex;
		align-items: center;
		
		.headimg {
			width: 50rpx;
			// flex: 0  0  50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: 6rpx;
		}
		
		.danmu-text {
			white-space: nowrap;
		}
	}
	@keyframes damumove
	{
		from {left: 750rpx;}
		to {left: -750rpx;}
	}
</style>
